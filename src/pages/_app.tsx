import { AppProps } from "next/app";
import dynamic from "next/dynamic";

import "semantic-ui-css/semantic.min.css";
import "#/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const CSR = dynamic(() => import("#/components/CSRInner"), { ssr: false });
  return (
    <CSR>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </CSR>
  );
};
MyApp.getInitialProps = async () => ({ pageProps: {} });

export default MyApp;
