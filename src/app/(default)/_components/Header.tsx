import Link from "next/link";

import { Box, Flex, Image } from "@mantine/core";

import Hamburger from "./Hamburger";
import ProfileSelector from "./ProfileSelector";
import SubMenu from "./SubMenu";

export default function Header() {
  return (
    <Box
      component="header"
      className="fixed left-0 top-0 z-30 h-auto w-full bg-white lg:h-screen lg:w-[300px] lg:p-4"
    >
      <Flex className="h-auto flex-row items-center justify-between gap-4 px-4 py-2 lg:h-full lg:flex-col">
        <Flex
          component={Link}
          className="justify-center transition-all duration-200 hover:opacity-50"
          style={{
            _hover: { opacity: 0.5 },
            transition: "all 0.2s ease-out",
            display: "flex",
            justifyContent: "center",
          }}
          href="/"
        >
          <Image
            alt="app logo"
            className="m-auto h-[10vw] max-h-12 min-h-6 w-auto pb-2 pl-0 lg:pl-2"
            src="/logo.png"
          />
        </Flex>
        <Box className="block lg:hidden">
          <Hamburger>
            <SubMenu />
          </Hamburger>
        </Box>
        <Flex className="hidden w-full grow flex-col justify-between lg:flex">
          <SubMenu />
          <Flex className="mb-6 flex-col items-center gap-2">
            <ProfileSelector />
            <Box className="text-center text-sm">
              © <Link href="https://twitter.com/newt239">newt239</Link>{" "}
              2022-2024
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
