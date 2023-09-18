import Image from "next/image";
import Link from "next/link";

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
      <div>
        <div
          className={css({
            transition: "all 0.2s ease-out",
            _hover: { opacity: 0.5 },
            lg: {
              mb: 100,
            },
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
                objectFit: "contain",
                position: "relative!important",
              })}
              fill
              src="/logo.png"
            />
          </Link>
        </div>
        <div
          className={css({
            display: "none",
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
