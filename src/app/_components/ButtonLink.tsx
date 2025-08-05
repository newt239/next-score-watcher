import Link from "next/link";

import { Button, type ButtonProps } from "@mantine/core";

export type Props = {
  children: React.ReactNode;
  href: string;
  className?: string;
} & ButtonProps;

const ButtonLink: React.FC<Props> = (props) => {
  const { children, href, className, ...rest } = props;
  return (
    <Button
      component={Link}
      href={href}
      className={className}
      target={href.startsWith("http") ? "_blank" : "_self"}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default ButtonLink;
