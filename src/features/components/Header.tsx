import { Link as ReactLink } from "react-router-dom";

import Hamburger from "~/features/components/Hamburger";
import SubMenu from "~/features/components/SubMenu";

import { css } from "@panda/css";
import Link from "~/components/custom/Link";

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
        p: 0,
        position: "fixed",
        top: 0,
        w: "100%",
        zIndex: 100,
        _dark: {
          backgroundColor: "gray.800",
        },
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
        <ReactLink
          className={css({
            _hover: { opacity: 0.5 },
            transition: "all 0.2s ease-out",
            display: "flex",
            justifyContent: "center",
          })}
          to="/"
        >
          <img
            alt="app logo"
            className={css({
              cursor: "pointer",
              height: "clamp(35px, 10vw, 50px)",
              width: "auto",
              margin: "auto",
              pb: 2,
              pl: [0, 2],
            })}
            src="/logo.png"
          />
        </ReactLink>
        <div
          className={css({
            display: "block",
            lg: {
              display: "none",
            },
          })}
        >
          <Hamburger>
            <SubMenu />
          </Hamburger>
        </div>
        <div
          className={css({
            display: "none",
            flexGrow: 1,
            lg: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          })}
        >
          <SubMenu />
          <div
            className={css({
              fontSize: "0.8rem",
              textAlign: "center",
            })}
          >
            <div>
              © <Link href="https://twitter.com/newt239">newt239</Link>{" "}
              2022-2024
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
