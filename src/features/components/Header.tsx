import { Link } from "react-router-dom";

import { Image } from "@chakra-ui/react";

import Hamburger from "./Hamburger";

import SubMenu from "#/features/components/SubMenu";
import { css } from "@panda/css";

const Header: React.FC = () => {
  return (
    <header
      className={css({
        backgroundColor: "white",
        left: 0,
        lg: {
          height: "100vh",
          p: "16px",
          width: 300,
        },
        p: "0px",
        position: "fixed",
        top: 0,
        w: "100%",
        zIndex: 100,
      })}
    >
      <div
        className={css({
          display: "flex",
          gap: "16px",
          justifyContent: "space-between",
          lg: {
            flexDirection: "column",
            h: "100%",
          },
          px: "16px",
          py: "8px",
        })}
      >
        <Link
          className={css({
            _hover: { opacity: 0.5 },
            transition: "all 0.2s ease-out",
          })}
          to="/"
        >
          <Image
            alt="app logo"
            className={css({
              cursor: "pointer",
              height: "clamp(20px, 10vw, 50px)!important",
              margin: "auto",
              pb: 2,
              pl: [0, 2],
              width: "auto!important",
            })}
            height={50}
            src="/logo.png"
            width={236}
          />
        </Link>
        <Hamburger>
          <SubMenu />
        </Hamburger>
        <div
          className={css({
            display: "none",
            flexGrow: 1,
            lg: {
              display: "block",
            },
          })}
        >
          <SubMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
