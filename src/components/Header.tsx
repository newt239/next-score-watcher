import Image from "next/image";
import NextLink from "next/link";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Spacer,
  useColorMode,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { Menu2 } from "tabler-icons-react";

import Logo from "#/assets/logo.png";

const Header: React.FC = () => {
  const [isLargerThan800] = useMediaQuery("(max-width: 800px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    <>
      <Flex
        sx={{
          py: 3,
          px: "5vw",
          alignItems: "center",
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
        <Box sx={{ transition: "all 0.2s ease-out" }} _hover={{ opacity: 0.5 }}>
          <NextLink href="/">
            <Image
              src={Logo}
              style={{
                maxHeight: "10vh",
                maxWidth: "300px",
                height: "auto",
                width: "auto",
                margin: "auto",
                cursor: "pointer",
              }}
              alt="app logo"
            />
          </NextLink>
        </Box>
        <Spacer />
        {isLargerThan800 ? (
          <>
            <IconButton
              variant="outline"
              size="md"
              onClick={onOpen}
              aria-label="open drawer"
            >
              <Menu2 />
            </IconButton>
          </>
        ) : (
          <SubMenu />
        )}
      </Flex>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>メニュー</DrawerHeader>
          <DrawerBody>
            <SubMenu vertical />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
