import NextLink from "next/link";
import { useRouter } from "next/router";

import { Box, Flex, LinkBox, useColorMode } from "@chakra-ui/react";
import { Home, QuestionMark, Settings2, User } from "tabler-icons-react";

const BottomBar = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  console.log(router.pathname);

  return (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        justifyContent: "space-between",
        bottom: 0,
        left: 0,
        width: "100%",
        bgColor: colorMode === "light" ? "gray.50" : "black",
        color: colorMode === "light" ? "black" : "white",
        transition: "all 0.5s ease",
        whiteSpace: "nowrap",
        boxShadow: "0 5px 10px 0 black",
        zIndex: 100,
      }}
    >
      <NextLink href="/" style={{ width: "25%", textAlign: "center" }}>
        <LinkBox
          color={router.pathname === "/" ? "green.500" : undefined}
          aria-label="ホーム"
          sx={{
            width: "100%",
            borderRadius: 0,
          }}
        >
          <Flex sx={{ flexDirection: "column", alignItems: "center", my: 1 }}>
            <Home />
            <span>ホーム</span>
          </Flex>
        </LinkBox>
      </NextLink>
      <NextLink href="/player" style={{ width: "25%" }}>
        <LinkBox
          color={router.pathname === "/player" ? "green.500" : undefined}
          aria-label="プレイヤー"
          sx={{
            width: "100%",
            borderRadius: 0,
          }}
        >
          <Flex sx={{ flexDirection: "column", alignItems: "center", my: 1 }}>
            <User />
            <span>プレイヤ－</span>
          </Flex>
        </LinkBox>
      </NextLink>
      <NextLink href="/quiz" style={{ width: "25%" }}>
        <LinkBox
          color={router.pathname === "/quiz" ? "green.500" : undefined}
          aria-label="問題"
          sx={{
            width: "100%",
            borderRadius: 0,
          }}
        >
          <Flex sx={{ flexDirection: "column", alignItems: "center", my: 1 }}>
            <QuestionMark />
            <span>問題</span>
          </Flex>
        </LinkBox>
      </NextLink>
      <NextLink href="/option" style={{ width: "25%" }}>
        <LinkBox
          color={router.pathname === "/option" ? "green.500" : undefined}
          aria-label="設定"
          sx={{
            width: "100%",
            borderRadius: 0,
          }}
        >
          <Flex sx={{ flexDirection: "column", alignItems: "center", my: 1 }}>
            <Settings2 />
            <span>設定</span>
          </Flex>
        </LinkBox>
      </NextLink>
    </Box>
  );
};

export default BottomBar;
