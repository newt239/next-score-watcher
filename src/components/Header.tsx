import Image from "next/image";
import NextLink from "next/link";

import { Box } from "@chakra-ui/react";

import Logo from "#/assets/logo.png";

const Header: React.FC = () => {
  return (
    <Box sx={{ pb: 5 }}>
      <NextLink href="/">
        <Image
          src={Logo}
          style={{
            maxHeight: "10vh",
            width: "auto",
            margin: "auto",
            cursor: "pointer",
          }}
          alt="app logo"
        />
      </NextLink>
    </Box>
  );
};

export default Header;
