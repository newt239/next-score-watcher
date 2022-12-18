import "../styles/globals.css";
import { NextPage } from "next";
import { AppProps } from "next/app";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
