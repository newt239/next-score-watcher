import { useMediaQuery } from "@chakra-ui/react";

const useDeviceWidth = (width?: number) => {
  const [isDesktop] = useMediaQuery(`(min-width: ${width || "800"}px)`);

  return isDesktop;
};

export default useDeviceWidth;
