import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "semantic-ui-css/semantic.min.css";
import "#/styles/globals.css";

import { GeistProvider, CssBaseline } from "@geist-ui/core";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const CSR = dynamic(() => import("#/components/CSRInner"), { ssr: false });
  return (
    <CSR>
      <GeistProvider>
        <CssBaseline />
        <Component {...pageProps} />/
      </GeistProvider>
    </CSR>
  );
};
MyApp.getInitialProps = async () => ({ pageProps: {} });

export default MyApp;
