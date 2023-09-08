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
        position: "fixed",
        display: "flex",
        justifyContent: "space-between",
        bottom: 0,
        left: 0,
        width: "100%",
        bgColor: "gray.50",
        color: "black",
        transition: "all 0.5s ease",
        whiteSpace: "nowrap",
        boxShadow: "0 5px 10px 0 black",
        zIndex: 100,
        _dark: {
          bgColor: "gray.900",
          color: "white",
        },
      }}
    >
      <Link href="/" style={{ width: "25%", textAlign: "center" }}>
        <LinkBox
          aria-label="ホーム"
          color={pathname === "/" ? "green.500" : undefined}
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
      </Link>
      <Link href="/player" style={{ width: "25%" }}>
        <LinkBox
          aria-label="プレイヤー"
          color={pathname === "/player" ? "green.500" : undefined}
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
      </Link>
      <Link href="/quiz" style={{ width: "25%" }}>
        <LinkBox
          aria-label="問題"
          color={pathname === "/quiz" ? "green.500" : undefined}
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
      </Link>
      <Link href="/option" style={{ width: "25%" }}>
        <LinkBox
          aria-label="設定"
          color={pathname === "/option" ? "green.500" : undefined}
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
      </Link>
    </Box>
  );
};

export default BottomBar;
