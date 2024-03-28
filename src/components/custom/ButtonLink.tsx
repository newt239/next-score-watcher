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
    <ReactLink to={href}>
      <Button className={className} {...rest}>
        {children}
      </Button>
    </ReactLink>
  );
};

export default ButtonLink;
