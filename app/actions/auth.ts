"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/server";

export async function signIn(prevData: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as "string";
  const password = formData.get("password") as "string";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/login");
  redirect("/login");
}
