import { ReactElement } from "react";

import { Box, Container, Spacer, useMediaQuery } from "@chakra-ui/react";

import BottomBar from "#/components/BottomBar";
import Footer from "#/components/Footer";
import Header from "#/components/Header";

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

export const Layout = ({ children }: LayoutProps) => {
  const [isLargerThan700] = useMediaQuery("(max-width: 700px)");
  return (
    <>
      <Header />
      <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>
        {children}
      </Container>
      <Footer />
      {isLargerThan700 && (
        <>
          <Box sx={{ height: "10vh" }} />
          <BottomBar />
        </>
      )}
    </>
  );
};
