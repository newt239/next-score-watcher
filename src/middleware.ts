import type { NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  // シンプルなmiddleware実装
  console.log(_request);
  // 認証関連の処理はbetter-authのコールバックで処理
  return;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
