import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import type { Metadata } from "next";

import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s - Score Watcher",
    default: "Score Watcher",
  },
  description:
    "競技クイズ用の得点表示ソフトです。プレイヤーの得点状況を可視化します。",
  themeColor: "#28a745",
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
  const theme = createTheme({
    primaryColor: "teal",
    defaultRadius: "md",
  });

  return (
    <html lang="ja">
      <head>
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
