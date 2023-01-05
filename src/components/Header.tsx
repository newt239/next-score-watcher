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
        <NextLink href="/players">プレイヤー管理</NextLink>
      </Flex>
    );
  };

  return (
    <>
      <Flex sx={{ py: 5, px: "5vw", alignItems: "center" }}>
        <NextLink href="/">
          <Image
            src={Logo}
            style={{
              maxHeight: "10vh",
              maxWidth: "50vw",
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
