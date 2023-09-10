import Image from "next/image";
import Link from "next/link";

import { Flex } from "@radix-ui/themes";

import SubMenu from "./SubMenu";

import { css } from "@panda/css";

const Header: React.FC = () => {
  return (
    <Flex
      className={css({
        w: "100%",
        margin: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgColor: "black",
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
              height: "auto",
              width: "auto",
              pb: 2,
              pl: [0, 2],
              maxHeight: "7vh",
              maxWidth: "300px",
              margin: "auto",
              cursor: "pointer",
            })}
            height="127"
            src="/logo.png"
            width="696"
          />
        </Link>
      </div>
      <div className={css({ lg: { display: "none" } })}>
        <SubMenu />
      </div>
    </Flex>
  );
};

export default Header;
