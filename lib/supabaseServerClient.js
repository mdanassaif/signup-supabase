import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"; // For handling cookies in Next.js 13+

export const createSupabaseServerClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies, // Handles session-based auth
    }
  );
};
