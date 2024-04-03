import { useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import usePageTracking from "~/hooks/usePageTracking";

function ScrollTop() {
  usePageTracking();
  const { pathname } = useLocation();
  const { colorMode } = useColorMode();

  useEffect(() => {
    window.scrollTo(0, 0);
    const temporalCanonicalLink = document.querySelector(
      "link[rel='canonical']"
    );
    const canonicalLink = !!temporalCanonicalLink
      ? temporalCanonicalLink
      : document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    canonicalLink.setAttribute("href", `https://score-watcher.com${pathname}`);
    document.head.appendChild(canonicalLink);
  }, [pathname]);

  useEffect(() => {
    if (colorMode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [colorMode]);

  return null;
}

export default ScrollTop;
