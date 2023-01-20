import { AppPropsWithLayout } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";

import "#/styles/globals.css";

import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const CSR = dynamic(() => import("#/components/CSRInner"), { ssr: false });
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <CSR>
        <ChakraProvider>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </CSR>
    </>
  );
}
MyApp.getInitialProps = async () => ({ pageProps: {} });

export default MyApp;
