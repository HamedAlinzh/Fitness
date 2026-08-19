import type { ReactNode } from "react";
import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth/dal";
import { logoutAction } from "@/lib/actions/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  // This gate is for the chrome only. Because layouts don't re-run on client-side
  // navigation and don't stop nested segments from rendering, each page and action
  // under this layout calls requireAdmin() itself as the real security boundary.
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-red-50/40">
      <header className="border-b border-red-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-extrabold text-ink-900">پنل مدیریت</h1>
              <p className="text-sm text-ink-500">خوش آمدی، {admin.name}</p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                خروج
              </button>
            </form>
          </div>

          <AdminNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
