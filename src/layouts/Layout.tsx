import { ReactElement } from "react";

import { Container } from "@chakra-ui/react";

import Footer from "#/components/Footer";
import Header from "#/components/Header";

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

export const Layout = ({ children }: LayoutProps) => (
  <>
    <Header />
    <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>{children}</Container>
    <Footer />
  </>
);
