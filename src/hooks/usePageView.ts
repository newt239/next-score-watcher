import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { GA_ID, pageview } from "#/utils/gtag";

export const usePageView = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!GA_ID) return;

    const handleRouteChange = (url: string, { shallow }: any) => {
      if (!shallow) {
        pageview(url);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
};
