import Image from "next/image";
import NextLink from "next/link";

import {
  Box,
  Button,
  Flex,
  Spacer,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";

import Logo from "#/assets/logo.png";

const Header: React.FC = () => {
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
  const { colorMode } = useColorMode();

  const linkList: { text: string; path: string }[] = [
    { text: "ホーム", path: "/" },
    { text: "プレイヤー管理", path: "/player" },
    { text: "問題管理", path: "/quiz" },
    { text: "アプリ設定", path: "/option" },
  ];

  const SubMenu: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
    return (
      <Flex
        sx={{
          flexDirection: vertical ? "column" : "row",
          fontWeight: 800,
        }}
      >
        {linkList.map((link) => (
          <NextLink key={link.path} href={link.path}>
            <Button variant="ghost">{link.text}</Button>
          </NextLink>
        ))}
      </Flex>
    );
  };

  return (
    <Box
      sx={{
        p: 3,
        margin: "auto",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 10,
        backdropFilter: "blur(8px)",
        borderStyle: "solid",
        borderWidth: "0px 0px thin",
        borderColor:
          colorMode === "light"
            ? "rgb(231, 235, 240)"
            : "rgba(194, 224, 255, 0.08)",
        backgroundColor:
          colorMode === "light"
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(10, 25, 41, 0.7)",
      }}
    >
      <Flex
        sx={{
          maxW: 1000,
          margin: "auto",
          alignItems: "center",
        }}
      >
        <Box sx={{ transition: "all 0.2s ease-out" }} _hover={{ opacity: 0.5 }}>
          <NextLink href="/">
            <Image
              src={Logo}
              style={{
                height: "auto",
                width: "auto",
                maxHeight: "7vh",
                maxWidth: "300px",
                margin: "auto",
                cursor: "pointer",
              }}
              alt="app logo"
            />
          </NextLink>
        </Box>
        {isLargerThan800 && (
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
