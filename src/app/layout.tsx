import type { Metadata } from "next";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { GoogleTagManager } from "@next/third-parties/google";

import ClientRoot from "@/app/_components/ClientRoot";

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
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(d){var config={kitId:"uel8jnk",scriptTimeout:3000,async:true},h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive"},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src="https://use.typekit.net/"+config.kitId+".js";tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)})(document);`,
          }}
        />
        {process.env.NODE_ENV === "production" && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_ID!} />
        )}
        <ColorSchemeScript />
      </head>
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
};

export default RootLayout;
