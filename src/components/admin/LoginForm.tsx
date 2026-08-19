"use client";

import { useActionState } from "react";
import { LogIn, AlertCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-4 text-right">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink-700">
          ایمیل
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          dir="ltr"
          className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink-700">
          رمز عبور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          dir="ltr"
          className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
        />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600 disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" />
        {pending ? "در حال ورود…" : "ورود به پنل"}
      </button>
    </form>
  );
}
