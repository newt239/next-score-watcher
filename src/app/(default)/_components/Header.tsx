import Image from "next/image";
import Link from "next/link";

import Account from "./Account";
import Hamburger from "./Hamburger";
import SubMenu from "./SubMenu";

import { css } from "@panda/css";

const Header: React.FC = () => {
  return (
    <header
      className={css({
        w: "100%",
        p: "0px",
        backgroundColor: "white",
        zIndex: 100,
        position: "fixed",
        top: 0,
        left: 0,
        lg: {
          p: "16px",
          width: 300,
          height: "100vh",
        },
      })}
    >
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          px: "16px",
          py: "8px",
          lg: {
            flexDirection: "column",
            h: "100%",
          },
        })}
      >
        <div
          className={css({
            transition: "all 0.2s ease-out",
            _hover: { opacity: 0.5 },
          })}
        >
          <Link href="/">
            <Image
              alt="app logo"
              className={css({
                pb: 2,
                pl: [0, 2],
                width: "auto!important",
                height: "clamp(20px, 10vw, 50px)!important",
                margin: "auto",
                cursor: "pointer",
                position: "relative",
              })}
              fill
              src="/logo.png"
            />
          </Link>
        </div>
        <Hamburger>
          <SubMenu />
          <Account />
        </Hamburger>
        <div
          className={css({
            flexGrow: 1,
            display: "none",
            lg: {
              display: "block",
            },
          })}
        >
          <SubMenu />
        </div>
        <div
          className={css({
            display: "none",
            lg: {
              display: "block",
            },
          })}
        >
          <Account />
        </div>
      </div>
    </header>
  );
};

export default Header;
