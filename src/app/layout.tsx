import type { Metadata } from "next";

import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import UpdateModal from "./_components/UpdateModal";

import TypekitLoader from "@/app/_components/TypekitLoader";
import { theme } from "@/utils/theme";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://score-watcher.com"),
  title: {
    template: "%s - Score Watcher",
    default: "Score Watcher",
  },
  description: "競技クイズ用の得点表示ソフトです。プレイヤーの得点状況を可視化します。",
  openGraph: {
    title: "Score Watcher",
    description: "競技クイズ用の得点表示ソフトです。プレイヤーの得点状況を可視化します。",
    siteName: "Score Watcher",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    site: "@newt239",
    creator: "@newt239",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <meta name="theme-color" content="#28a745" />
        <link rel="manifest" href="/manifest.json" />
        {process.env.NODE_ENV === "production" && (
          <>
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_ID!} />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_TAG_ID!} />
          </>
        )}
        <ColorSchemeScript />
        <TypekitLoader />
      </head>
      <body>
        <NuqsAdapter>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              {children}
              <UpdateModal />
            </ModalsProvider>
            <Notifications />
          </MantineProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
};

export default RootLayout;
