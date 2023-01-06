import NextDocument, { Html, Head, Main, NextScript } from "next/document";

import { ColorModeScript } from "@chakra-ui/react";

import theme from "#/utils/theme";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
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
