import { useMediaQuery } from "@chakra-ui/react";

const useDeviceWidth = (width?: number) => {
  const [isDesktop] = useMediaQuery(`(min-width: ${width || 768}px)`);

  return isDesktop;
};

export default useDeviceWidth;
