"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "ایمیل و رمز عبور را وارد کنید." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // A single generic message for "no such user", "wrong password" and "not an admin"
  // so the form can't be used to discover which admin emails exist.
  const invalid = { error: "ایمیل یا رمز عبور اشتباه است." };

  if (!user || user.role !== "ADMIN") {
    // Still spend the hashing time so a missing user isn't detectably faster.
    await verifyPassword(password, "scrypt$00$00");
    return invalid;
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return invalid;

  await createSession(user.id, user.role);
  redirect("/admin");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
