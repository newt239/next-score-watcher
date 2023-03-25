import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import usePageTracking from "#/hooks/usePageTracking";

function ScrollTop() {
  usePageTracking();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollTop;
