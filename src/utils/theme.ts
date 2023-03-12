import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
});

export const colors = {
  gray: {
    50: "#F7FAFC",
    200: "#E2E8F0",
    300: "#CBD5E0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
  },
  red: {
    light: "#C53030",
    dark: "#FC8181",
  },
  blue: {
    light: "#2B6CB0",
    dark: "#63B3ED",
  },
  green: {
    light: "#2F855A",
    dark: "#F6E05E",
  },
};

export default theme;
