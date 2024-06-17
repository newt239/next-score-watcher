import type { Metadata } from "next";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

import { theme } from "@/utils/theme";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s - Score Watcher",
    default: "Score Watcher",
  },
  description:
    "競技クイズ用の得点表示ソフトです。プレイヤーの得点状況を可視化します。",
  openGraph: {
    title: "Score Watcher",
    description:
      "競技クイズ用の得点表示ソフトです。プレイヤーの得点状況を可視化します。",
    siteName: "Score Watcher",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    site: "@newt239",
    creator: "@newt239",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#28a745" />
        <link rel="manifest" href="/manifest.json" />
        <GoogleTagManager gtmId={process.env.GA_ID!} />
        <GoogleAnalytics gaId={process.env.TAG_ID!} />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          {children}
          <Notifications />
        </MantineProvider>
      </body>
    </html>
  );
}
