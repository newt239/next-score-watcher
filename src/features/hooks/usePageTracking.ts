import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { recordPageView } from "#/utils/ga4";

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    recordPageView(location.pathname + location.search);
  }, [location]);
};

export default usePageTracking;
