"use server";

import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { deleteUpload, saveUpload } from "@/lib/uploads";
import { BLOG_LIMITS, slugify } from "@/lib/blog";

/**
 * Admin-only. Like every other action under the admin panel, each one calls
 * `requireAdmin()` itself — Server Actions are public HTTP endpoints and the layout is
 * not the security boundary (see CLAUDE.md).
 */

export type BlogState = { error?: string; success?: string } | undefined;

/**
 * The homepage preview and the /blog index are statically rendered, and the post page
 * for an existing slug may already be prerendered, so every one of them has to be told.
 */
function revalidateBlog() {
  // `[lang]` is revalidated as a whole, which also covers every post URL — old slug
  // after a rename included — in both languages.
  revalidatePublicSite();
  revalidatePath("/admin/blog");
}

type Parsed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
};

function parseFields(formData: FormData): Parsed | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  // Textareas submit CRLF; the post page splits paragraphs on "\n", and a stray "\r"
  // would survive the split as a truthy, empty-looking paragraph.
  const content = String(formData.get("content") ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
  const published = String(formData.get("published") ?? "") === "on";

  // An empty slug field means "derive it from the title", which is the normal case.
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);

  // The form's required/maxLength attributes are a convenience; an action is reachable
  // without the form at all.
  if (!title || !excerpt || !content) {
    return { error: "عنوان، چکیده و متن مقاله را پر کن." };
  }
  if (
    title.length > BLOG_LIMITS.title ||
    excerpt.length > BLOG_LIMITS.excerpt ||
    content.length > BLOG_LIMITS.content
  ) {
    return { error: "یکی از متن‌ها از حد مجاز طولانی‌تر است." };
  }
  if (!slug) {
    return { error: "از این عنوان نشانی ساخته نشد — یک نشانی دستی بنویس." };
  }

  return { title, slug, excerpt, content, published };
}

/**
 * `slug` is unique. Rather than rejecting a title the coach legitimately wants to reuse,
 * a numeric suffix is appended; the editor shows the final URL afterwards.
 */
async function uniqueSlug(slug: string, exceptId?: string): Promise<string> {
  for (let suffix = 1; ; suffix += 1) {
    const candidate = suffix === 1 ? slug : `${slug}-${suffix}`;
    const clash = await prisma.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!clash || clash.id === exceptId) return candidate;
  }
}

export async function createBlogPost(
  _prev: BlogState,
  formData: FormData
): Promise<BlogState> {
  await requireAdmin();

  const parsed = parseFields(formData);
  if ("error" in parsed) return parsed;

  const file = formData.get("coverImage");
  let coverImage: string | null = null;

  if (file instanceof File && file.size > 0) {
    const saved = await saveUpload(file);
    if (!saved.ok) return { error: saved.error };
    coverImage = saved.url;
  }

  const slug = await uniqueSlug(parsed.slug);

  await prisma.blogPost.create({
    data: {
      ...parsed,
      slug,
      coverImage,
      publishedAt: parsed.published ? new Date() : null,
    },
  });

  revalidateBlog();
  // Straight back to the list, where the new post is now visible.
  redirect("/admin/blog");
}

export async function updateBlogPost(
  _prev: BlogState,
  formData: FormData
): Promise<BlogState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "مقاله مشخص نیست." };

  const parsed = parseFields(formData);
  if ("error" in parsed) return parsed;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return { error: "این مقاله پیدا نشد." };

  const file = formData.get("coverImage");
  let coverImage = existing.coverImage;
  let replaced: string | null = null;

  if (file instanceof File && file.size > 0) {
    const saved = await saveUpload(file);
    if (!saved.ok) return { error: saved.error };
    replaced = coverImage;
    coverImage = saved.url;
  }

  const slug = await uniqueSlug(parsed.slug, id);

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...parsed,
      slug,
      coverImage,
      // Stamped the first time it goes live and then left alone, so re-editing an old
      // post doesn't shuffle it back to the top of the blog.
      publishedAt:
        parsed.published && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
    },
  });

  // Only after the row points at the new file.
  await deleteUpload(replaced);

  // The old slug's page has to be dropped too when the URL changed.
  revalidateBlog();

  return {
    success:
      slug === parsed.slug
        ? "مقاله ذخیره شد."
        : `مقاله ذخیره شد. نشانی «${slug}» استفاده شد چون نشانی قبلی تکراری بود.`,
  };
}

export async function setBlogPostPublished(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "") === "true";
  if (!id) return;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.blogPost.update({
    where: { id },
    data: {
      published,
      publishedAt:
        published && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });

  revalidateBlog();
}

export async function removeBlogCover(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing?.coverImage) return;

  await prisma.blogPost.update({ where: { id }, data: { coverImage: null } });
  await deleteUpload(existing.coverImage);

  revalidateBlog();
  revalidatePath(`/admin/blog/${id}`);
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.blogPost.delete({ where: { id } });
  await deleteUpload(existing.coverImage);

  revalidateBlog();
  redirect("/admin/blog");
}
