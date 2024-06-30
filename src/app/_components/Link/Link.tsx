import { default as NextLink } from "next/link";

import { Anchor } from "@mantine/core";
import { ExternalLink } from "tabler-icons-react";

import classes from "./Link.module.css";

type Props = {
  children: React.ReactNode;
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const Link: React.FC<Props> = (props) => {
  const { children, href, ...rest } = props;
  return (
    <Anchor
      component={NextLink}
      className={classes.link}
      href={href}
      {...rest}
      target={href.startsWith("http") ? "_blank" : "_self"}
    >
      {children}
      {href.startsWith("http") && <ExternalLink />}
    </Anchor>
  );
};

export default Link;
