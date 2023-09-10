import Image from "next/image";
import Link from "next/link";

import Box from "#/components/ui/Box";
import Flex from "#/components/ui/Flex";
import { css } from "@panda/css";

const Footer: React.FC = () => {
  return (
    <Flex
      sx={{
        gap: "0.5rem",
        justifyContent: "center",
        alignItems: "flex-end",
        margin: "auto",
        my: 5,
        h: "1rem",
        lineHeight: "0.8rem",
        fontSize: "0.5rem",
      }}
    >
      <Image
        alt="Score Watcher"
        className={css({ h: "100%" })}
        src="./logo.png"
      />
      <Box>
        by{" "}
        <Link color="blue.500" href="https://twitter.com/newt239">
          @newt239
        </Link>
      </Box>
    </Flex>
  );
};

export default Footer;
