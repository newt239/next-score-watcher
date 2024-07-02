import type { Metadata } from "next";
import Script from "next/script";

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
        {process.env.NODE_ENV === "production" && (
          <>
            <GoogleTagManager gtmId={process.env.GA_ID!} />
            <GoogleAnalytics gaId={process.env.TAG_ID!} />
          </>
        )}
        <ColorSchemeScript />
        <Script id="adobe-font">
          {`(function(d) {
            const config = {
              kitId: 'uel8jnk',
              scriptTimeout: 3000,
              async: true
            },
            h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
          })(document);
          `}
        </Script>
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
