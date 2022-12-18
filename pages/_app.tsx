import "../styles/globals.css";
import { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};
MyApp.getInitialProps = async () => ({ pageProps: {} });

export default MyApp;
