import { AppProps } from "next/app";
import "semantic-ui-css/semantic.min.css";
import "#/styles/globals.css";
import dynamic from "next/dynamic";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const CSR = dynamic(() => import("#/components/CSRInner"), { ssr: false });
  return (
    <CSR>
      <Component {...pageProps} />
    </CSR>
  );
};
MyApp.getInitialProps = async () => ({ pageProps: {} });

export default MyApp;
