"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Box, Flex, LinkBox } from "@chakra-ui/react";
import { Home, QuestionMark, Settings2, User } from "tabler-icons-react";

const BottomBar = () => {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        bgColor: "gray.50",
        bottom: 0,
        boxShadow: "0 5px 10px 0 black",
        _dark: {
          bgColor: "gray.900",
          color: "white",
        },
        color: "black",
        display: "flex",
        justifyContent: "space-between",
        left: 0,
        position: "fixed",
        transition: "all 0.5s ease",
        whiteSpace: "nowrap",
        width: "100%",
        zIndex: 100,
      }}
    >
      <Link href="/" style={{ textAlign: "center", width: "25%" }}>
        <LinkBox
          aria-label="ホーム"
          color={pathname === "/" ? "green.500" : undefined}
          sx={{
            borderRadius: 0,
            width: "100%",
          }}
        >
          <Flex sx={{ alignItems: "center", flexDirection: "column", my: 1 }}>
            <Home />
            <span>ホーム</span>
          </Flex>
        </LinkBox>
      </Link>
      <Link href="/player" style={{ width: "25%" }}>
        <LinkBox
          aria-label="プレイヤー"
          color={pathname === "/player" ? "green.500" : undefined}
          sx={{
            borderRadius: 0,
            width: "100%",
          }}
        >
          <Flex sx={{ alignItems: "center", flexDirection: "column", my: 1 }}>
            <User />
            <span>プレイヤ－</span>
          </Flex>
        </LinkBox>
      </Link>
      <Link href="/quiz" style={{ width: "25%" }}>
        <LinkBox
          aria-label="問題"
          color={pathname === "/quiz" ? "green.500" : undefined}
          sx={{
            borderRadius: 0,
            width: "100%",
          }}
        >
          <Flex sx={{ alignItems: "center", flexDirection: "column", my: 1 }}>
            <QuestionMark />
            <span>問題</span>
          </Flex>
        </LinkBox>
      </Link>
      <Link href="/option" style={{ width: "25%" }}>
        <LinkBox
          aria-label="設定"
          color={pathname === "/option" ? "green.500" : undefined}
          sx={{
            borderRadius: 0,
            width: "100%",
          }}
        >
          <Flex sx={{ alignItems: "center", flexDirection: "column", my: 1 }}>
            <Settings2 />
            <span>設定</span>
          </Flex>
        </LinkBox>
      </Link>
    </Box>
  );
};

export default BottomBar;
