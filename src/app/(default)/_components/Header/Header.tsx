import Link from "next/link";

import { Box, Flex, Image } from "@mantine/core";

import Hamburger from "../Hamburger";
import SubMenu from "../SubMenu";

import classes from "./Header.module.css";

export default function Header() {
  return (
    <Box component="header" className={classes.header}>
      <Flex className={classes.header_inner}>
        <Flex component={Link} className={classes.header_link} href="/">
          <Image
            alt="app logo"
            className={classes.header_logo}
            src="/logo.png"
          />
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
              © <Link href="https://twitter.com/newt239">newt239</Link>
            </Box>
            <Box>2022-2024</Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
