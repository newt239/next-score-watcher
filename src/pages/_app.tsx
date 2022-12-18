import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "#/styles/globals.css";

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
