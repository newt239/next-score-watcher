import Image from "next/image";
import NextLink from "next/link";

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Spacer,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { Menu2 } from "tabler-icons-react";

import Logo from "#/assets/logo.png";

const Header: React.FC = () => {
  const [isLargerThan800] = useMediaQuery("(max-width: 800px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const SubMenu: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
    return (
      <Flex
        sx={{
          gap: 5,
          flexDirection: vertical ? "column" : "row",
          fontWeight: 800,
        }}
      >
        <NextLink href="/">ホーム</NextLink>
        <NextLink href="/quiz">問題管理</NextLink>
        <NextLink href="/player">プレイヤー管理</NextLink>
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
          borderColor: "rgb(231, 235, 240)",
          borderWidth: "0px 0px thin",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "rgb(45, 56, 67)",
        }}
      >
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
        )}{" "}
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
