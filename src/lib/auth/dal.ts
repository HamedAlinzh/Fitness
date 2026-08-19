import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSessionCookie } from "@/lib/auth/session";

export type AdminUser = {
  id: string;
  name: string;
  email: string | null;
};

/**
 * Data Access Layer entry point. The signed cookie alone is not trusted for
 * authorization — the user is re-read from the database on every render pass so a
 * demoted or deleted admin loses access immediately rather than when their token
 * happens to expire. `cache` dedupes that lookup within a single render.
 *
 * Next.js layouts do not re-run on client-side navigation and do not gate whether
 * nested segments render, so every admin page and every Server Action must call this
 * itself rather than relying on the panel layout.
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const session = await readSessionCookie();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    // Never select passwordHash into application code.
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user || user.role !== "ADMIN") return null;

  return { id: user.id, name: user.name, email: user.email };
});

/** Same as `getAdmin`, but redirects to the login page instead of returning null. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
