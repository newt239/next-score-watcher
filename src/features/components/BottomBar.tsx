import { Link as ReactLink, useLocation } from "react-router-dom";

import { LinkBox } from "@chakra-ui/react";
import { Home, QuestionMark, Settings2, User } from "tabler-icons-react";

import { css } from "@panda/css";

const BottomBar = () => {
  const location = useLocation();

  return (
    <div
      className={css({
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
      })}
    >
      <ReactLink style={{ width: "25%", textAlign: "center" }} to="/">
        <LinkBox
          aria-label="ホーム"
          className={css({
            width: "100%",
            borderRadius: 0,
          })}
          color={location.pathname === "/" ? "green.500" : undefined}
        >
          <div
            className={css({
              flexDirection: "column",
              alignItems: "center",
              my: 1,
            })}
          >
            <Home />
            <span>ホーム</span>
          </div>
        </LinkBox>
      </ReactLink>
      <ReactLink style={{ width: "25%" }} to="/player">
        <LinkBox
          aria-label="プレイヤー"
          className={css({
            width: "100%",
            borderRadius: 0,
          })}
          color={location.pathname === "/player" ? "green.500" : undefined}
        >
          <div
            className={css({
              flexDirection: "column",
              alignItems: "center",
              my: 1,
            })}
          >
            <User />
            <span>プレイヤ－</span>
          </div>
        </LinkBox>
      </ReactLink>
      <ReactLink style={{ width: "25%" }} to="/quiz">
        <LinkBox
          aria-label="問題"
          className={css({
            width: "100%",
            borderRadius: 0,
          })}
          color={location.pathname === "/quiz" ? "green.500" : undefined}
        >
          <div
            className={css({
              flexDirection: "column",
              alignItems: "center",
              my: 1,
            })}
          >
            <QuestionMark />
            <span>問題</span>
          </div>
        </LinkBox>
      </ReactLink>
      <ReactLink style={{ width: "25%" }} to="/option">
        <LinkBox
          aria-label="設定"
          className={css({
            width: "100%",
            borderRadius: 0,
          })}
          color={location.pathname === "/option" ? "green.500" : undefined}
        >
          <div
            className={css({
              flexDirection: "column",
              alignItems: "center",
              my: 1,
            })}
          >
            <Settings2 />
            <span>設定</span>
          </div>
        </LinkBox>
      </ReactLink>
    </div>
  );
};

export default BottomBar;
