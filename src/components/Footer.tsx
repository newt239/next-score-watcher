import NextLink from "next/link";

import { Box, Flex } from "@chakra-ui/react";
import { BrandGithub } from "tabler-icons-react";
const Footer: React.FC = () => {
  return (
    <>
      <Flex
        sx={{
          gap: 5,
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          my: 5,
        }}
      >
        <Box>© newt 2023</Box>
        <Box>v{localStorage.getItem("VERSION")}</Box>
        <NextLink
          href="https://github.com/newt239/next-score-watcher"
          passHref
          target="_blank"
        >
          <BrandGithub />
        </NextLink>
      </Flex>
    </>
  );
};

export default Footer;
