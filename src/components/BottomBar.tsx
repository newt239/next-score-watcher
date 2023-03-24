import { Link as ReactLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { Box, Flex, LinkBox, useColorMode } from "@chakra-ui/react";
import { Home, QuestionMark, Settings2, User } from "tabler-icons-react";

const BottomBar = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();

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
      <ReactLink to="/" style={{ width: "25%", textAlign: "center" }}>
        <LinkBox
          color={location.pathname === "/" ? "green.500" : undefined}
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
      </ReactLink>
      <ReactLink to="/player" style={{ width: "25%" }}>
        <LinkBox
          color={location.pathname === "/player" ? "green.500" : undefined}
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
      </ReactLink>
      <ReactLink to="/quiz" style={{ width: "25%" }}>
        <LinkBox
          color={location.pathname === "/quiz" ? "green.500" : undefined}
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
      </ReactLink>
      <ReactLink to="/option" style={{ width: "25%" }}>
        <LinkBox
          color={location.pathname === "/option" ? "green.500" : undefined}
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
      </ReactLink>
    </Box>
  );
};

export default BottomBar;
