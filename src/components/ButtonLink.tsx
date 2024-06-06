import { Button, ButtonProps } from "@mantine/core";
import Link from "next/link";

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
