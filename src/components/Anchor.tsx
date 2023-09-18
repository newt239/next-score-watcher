import Link from "next/link";

import { SystemStyleObject } from "@pandacss/dev";
import { ExternalLink } from "tabler-icons-react";

import { css, cva } from "@panda/css";

export const linkRecipe = cva({
  base: {
    color: "blue.500",
    display: "inline-flex",
    _hover: {
      textDecoration: "underline",
    },
  },
});

export type LinkProps = {
  children: React.ReactNode;
  href: string;
  sx?: SystemStyleObject;
} & React.HTMLAttributes<HTMLAnchorElement>;

const Anchor: React.FC<LinkProps> = ({ children, href, sx, ...props }) => {
  return (
    <Link
      className={css(linkRecipe.raw(), sx)}
      href={href}
      {...props}
      target={href.startsWith("http") ? "_blank" : "_self"}
    >
      {children}
      {href.startsWith("http") && <ExternalLink />}
    </Link>
  );
};

export default Anchor;
