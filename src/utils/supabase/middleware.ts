import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "./server";

export const updateSession = async (request: NextRequest) => {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = await createClient();

    await supabase.auth.getUser();

    const { error } = await supabase.auth.getSession();
    if (error) return response;

    return response;
  } catch (e) {
    console.error(e);

    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
