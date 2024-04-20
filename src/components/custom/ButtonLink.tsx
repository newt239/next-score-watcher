import { Button, ButtonProps } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";

export type ButtonLinkProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
} & ButtonProps;

const ButtonLink: React.FC<ButtonLinkProps> = (props) => {
  const { children, href, className, ...rest } = props;
  return (
    <Button
      as={ReactLink}
      to={href}
      className={className}
      target={href.startsWith("http") ? "_blank" : "_self"}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default ButtonLink;
