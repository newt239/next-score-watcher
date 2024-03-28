import { Box, Flex, Image, Link } from "@chakra-ui/react";

import Logo from "~/assets/logo.png";

const Footer: React.FC = () => {
  return (
    <>
      <Flex
        sx={{
          gap: "0.5rem",
          justifyContent: "center",
          alignItems: "flex-end",
          margin: "auto",
          my: 5,
          h: "1rem",
          lineHeight: "0.8rem",
          fontSize: "0.5rem",
        }}
      >
        <Image alt="Score Watcher" src={Logo} sx={{ h: "100%" }} />
        <Box>
          by{" "}
          <Link color="blue.500" href="https://twitter.com/newt239" isExternal>
            @newt239
          </Link>
        </Box>
      </Flex>
    </>
  );
};

export default Footer;
