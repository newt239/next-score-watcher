import type { NextPage, NextPageWithLayout } from "next";
import type { AppProps } from "next/app";
import type { ReactElement } from "react";

declare module "next" {
  type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactElement;
  };
}

declare module "next/app" {
  type AppPropsWithLayout<P = {}> = AppProps<P> & {
    Component<P>;
  };
}

interface Window {
  gtag(type: "config", googleAnalyticsId: string, { page_path: string });
  gtag(
    type: "event",
    eventAction: string,
    fieldObject: {
      event_label: string;
      event_category: string;
      value?: number;
    }
  );
}
