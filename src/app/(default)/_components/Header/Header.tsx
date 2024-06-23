import Link from "next/link";

import { Box, Flex } from "@mantine/core";

import Hamburger from "../Hamburger/Hamburger";
import SubMenu from "../SubMenu";

import classes from "./Header.module.css";

export default function Header() {
  return (
    <Box component="header" className={classes.header}>
      <Flex className={classes.header_inner}>
        <Flex component={Link} className={classes.header_link} href="/">
          <picture className={classes.header_logo}>
            <source
              media="(max-width:62em)"
              srcSet="logo_white.png 400w"
              sizes="100vw"
            />
            <img src="logo_white2.png" alt="app logo" />
          </picture>
        </Flex>
        <Box hiddenFrom="md">
          <Hamburger>
            <SubMenu />
          </Hamburger>
        </Box>
        <Flex hidden visibleFrom="md" className={classes.header_menu_desktop}>
          <SubMenu />
          <Flex className={classes.header_copyright}>
            <Box>
              ©{" "}
              <Link href="https://twitter.com/newt239" target="_blank">
                newt239
              </Link>
            </Box>
            <Box>2022-2024</Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
