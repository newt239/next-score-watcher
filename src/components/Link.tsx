import { Anchor } from "@mantine/core";
import { default as NextLink } from "next/link";
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
      {href.startsWith("http") && <ExternalLink className="ml-2" />}
    </Anchor>
  );
};

export default Link;
