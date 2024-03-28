import { Image, Link } from "@chakra-ui/react";

import Logo from "#/assets/logo.png";
import { css } from "@panda/css";

const Footer: React.FC = () => {
  return (
    <>
      <div
        className={css({
          display: "flex",
          gap: "0.5rem",
          justifyContent: "center",
          alignItems: "flex-end",
          margin: "auto",
          my: 5,
          h: "1rem",
          lineHeight: "0.8rem",
          fontSize: "0.5rem",
        })}
      >
        <Image alt="Score Watcher" className={css({ h: "100%" })} src={Logo} />
        <div>
          by{" "}
          <Link color="blue.500" href="https://twitter.com/newt239" isExternal>
            @newt239
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
