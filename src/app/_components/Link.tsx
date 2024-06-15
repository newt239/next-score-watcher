import { default as NextLink } from "next/link";

import { Anchor } from "@mantine/core";
import { ExternalLink } from "tabler-icons-react";

type Props = {
  children: React.ReactNode;
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const Link: React.FC<Props> = (props) => {
  const { children, href, ...rest } = props;
  return (
    <Anchor
      component={NextLink}
      className="inline-flex text-blue-500 hover:underline"
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