import { ReactElement } from "react";

import { Box, Container } from "@chakra-ui/react";

import BottomBar from "#/components/BottomBar";
import Footer from "#/components/Footer";
import Header from "#/components/Header";
import useDeviceWidth from "#/hooks/useDeviceWidth";

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

export const Layout = ({ children }: LayoutProps) => {
  const isDesktop = useDeviceWidth();
  return (
    <>
      <Header />
      <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>
        {children}
      </Container>
      <Footer />
      {!isDesktop && (
        <>
          <Box sx={{ height: "10vh" }} />
          <BottomBar />
        </>
      )}
    </>
  );
};
