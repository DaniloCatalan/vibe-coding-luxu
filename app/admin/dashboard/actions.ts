"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // This is a server action, so we can't set cookies easily without more setup,
          // but for RPC it's fine since we're just reading the auth token.
        },
      },
    }
  );

  const { error } = await supabase.rpc("set_user_role", {
    target_user_id: userId,
    new_role: newRole,
  });

  if (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}
