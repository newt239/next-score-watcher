import { Link as ReactLink, useLocation } from "react-router-dom";

import { Box, LinkBox } from "@chakra-ui/react";
import { Home, QuestionMark, Settings2, User } from "tabler-icons-react";

const BottomBar = () => {
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
      <ReactLink style={{ width: "25%", textAlign: "center" }} to="/">
        <LinkBox
          aria-label="ホーム"
          sx={{
            width: "100%",
            borderRadius: 0,
          }}
          color={location.pathname === "/" ? "green.500" : undefined}
        >
          <Box
            sx={{
              flexDirection: "column",
              alignItems: "center",
              my: 1,
            }}
          >
            <Home />
            <span>ホーム</span>
          </Box>
        </LinkBox>
      </ReactLink>
      <ReactLink style={{ width: "25%" }} to="/players">
        <LinkBox
          aria-label="プレイヤー"
          sx={{
            width: "100%",
            borderRadius: 0,
          }}
          color={location.pathname === "/players" ? "green.500" : undefined}
        >
          <Box
            sx={{
              flexDirection: "column",
              alignItems: "center",
              my: 1,
            }}
          >
            <User />
            <span>プレイヤ－</span>
          </Box>
        </LinkBox>
      </ReactLink>
      <ReactLink style={{ width: "25%" }} to="/quizes">
        <LinkBox
          aria-label="問題"
          sx={{
            width: "100%",
            borderRadius: 0,
          }}
          color={location.pathname === "/quizes" ? "green.500" : undefined}
        >
          <Box
            sx={{
              flexDirection: "column",
              alignItems: "center",
              my: 1,
            }}
          >
            <QuestionMark />
            <span>問題</span>
          </Box>
        </LinkBox>
      </ReactLink>
      <ReactLink style={{ width: "25%" }} to="/option">
        <LinkBox
          aria-label="設定"
          sx={{
            width: "100%",
            borderRadius: 0,
          }}
          color={location.pathname === "/option" ? "green.500" : undefined}
        >
          <Box
            sx={{
              flexDirection: "column",
              alignItems: "center",
              my: 1,
            }}
          >
            <Settings2 />
            <span>設定</span>
          </Box>
        </LinkBox>
      </ReactLink>
    </Box>
  );
};

export default BottomBar;
