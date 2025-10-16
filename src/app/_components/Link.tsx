import { default as NextLink } from "next/link";

import { Anchor } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

type Props = {
  children: React.ReactNode;
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const Link: React.FC<Props> = (props) => {
  const { children, href, ...rest } = props;
  return (
    <Anchor
      c="blue"
      component={NextLink}
      href={href}
      {...rest}
      target={href.startsWith("http") ? "_blank" : "_self"}
    >
      {children}
      {href.startsWith("http") && <IconExternalLink />}
    </Anchor>
  );
};

export default Link;
