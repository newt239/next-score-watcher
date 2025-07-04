import { NextResponse } from "next/server";

import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  return NextResponse.redirect("/", { status: 302 });
}
