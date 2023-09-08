import Link from "next/link";

import { Box, Flex, Image, Spacer } from "@chakra-ui/react";

import SubMenu from "#/app/(default)/_components/SubMenu";
import useDeviceWidth from "#/hooks/useDeviceWidth";

const Header: React.FC = () => {
  const desktop = useDeviceWidth();

  return (
    <Box
      sx={{
        px: 2,
        w: "100%",
        margin: "auto",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 10,
        backdropFilter: "blur(8px)",
        borderStyle: "solid",
        borderWidth: "0px 0px thin",
        borderColor: "rgb(231, 235, 240)",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        _dark: {
          borderColor: "rgba(194, 224, 255, 0.08)",
          backgroundColor: "rgba(10, 25, 41, 0.7)",
        },
      }}
    >
      <Flex
        sx={{
          maxW: 1000,
          margin: "auto",
          alignItems: "center",
          justifyContent: !desktop ? "center" : undefined,
        }}
      >
        <Box _hover={{ opacity: 0.5 }} sx={{ transition: "all 0.2s ease-out" }}>
          <Link href="/">
            <Image
              alt="app logo"
              src="/logo.png"
              sx={{
                height: "auto",
                width: "auto",
                pb: 2,
                pl: desktop ? 2 : 0,
                maxHeight: "7vh",
                maxWidth: "300px",
                margin: "auto",
                cursor: "pointer",
              }}
            />
          </Link>
        </Box>
        {desktop && (
          <>
            <Spacer />
            <SubMenu />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
