import NextDocument, { Head, Html, Main, NextScript } from "next/document";

import { ColorModeScript } from "@chakra-ui/react";

import { GA_ID } from "#/utils/gtag";
import theme from "#/utils/theme";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta name="theme-color" content="#28A745" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="icons/favicon-16x16.png"
          />
          <link
            rel="apple-touch-icon"
            type="image/png"
            href="/apple-touch-icon.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta property="og:title" content="Score Watcher" />
          <meta
            property="og:description"
            content="クイズ大会におけるプレイヤーの得点状況を可視化します。"
          />
          <meta
            property="og:image"
            content="https://score-watcher.newt239.dev/score-watcher-ogp.webp"
          />
          <meta property="og:url" content="https://score-watcher.newt239.dev" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Score Watcher" />
          {GA_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                   window.dataLayer = window.dataLayer || [];
                   function gtag(){dataLayer.push(arguments);}
                   gtag('js', new Date());
                   gtag('config', '${GA_ID}', {
                     page_path: window.location.pathname,
                   });`,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
