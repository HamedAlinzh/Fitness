import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import { getAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "ورود به پنل مدیریت",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Already signed in — skip the form.
  if (await getAdmin()) redirect("/admin");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-red-100 bg-white p-8 shadow-sm shadow-red-100/50">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-extrabold text-ink-900">پنل مدیریت</h1>
          <p className="text-sm leading-6 text-ink-500">
            برای مدیریت نظرات، تصاویر و درخواست‌های مشاوره وارد شوید.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
