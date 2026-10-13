import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/metadata";
import { getDict, getLocale } from "@/i18n/server";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import GalleryGrid from "@/components/sections/GalleryGrid";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/gallery">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).gallery;
  return pageMetadata(lang, "/gallery", {
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function GalleryPage() {
  const lang = await getLocale();
  const { gallery: t } = await getDict();
  const items = await prisma.galleryItem.findMany({
    orderBy: { takenAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />
      <GalleryGrid items={items} lang={lang} />
    </>
  );
}
