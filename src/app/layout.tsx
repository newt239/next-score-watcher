import type { Metadata } from "next";
import { BIZ_UDPGothic } from "next/font/google";
import { cookies } from "next/headers";

import NextTopLoader from "nextjs-toploader";

import "./globals.css";

const biz_font = BIZ_UDPGothic({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Score Watcher",
  description:
    "競技クイズ用の得点表示ソフトです。プレイヤーの得点状況を可視化します。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const colorTheme = (cookieStore.get("theme") ?? "light") as "light" | "dark";

  return (
    <html data-color-mode={colorTheme} lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="#28A745" name="theme-color" />
        <link href="/manifest.json" rel="manifest" />
        <meta content="Score Watcher" property="og:title" />
        <meta content="website" property="og:type" />
        <meta content="Score Watcher" property="og:site_name" />
        <meta
          content="競技クイズ用の得点表示ソフトです。プレイヤーの得点状況を可視化します。"
          property="og:description"
        />
        <meta content="https://score-watcher.newt239.dev" property="og:url" />
        <meta content="Score Watcher" name="twitter:title" />
        <meta
          content="競技クイズ用の得点表示ソフトです。プレイヤーの得点状況を可視化します。"
          name="twitter:description"
        />
        <meta content="@newt239" name="twitter:site" />
        <meta content="@newt239" name="twitter:creator" />
        <meta content="score-watcher.newt239.dev" name="twitter:domain" />
      </head>
      <body className={biz_font.className}>
        <NextTopLoader color="#28A745" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
