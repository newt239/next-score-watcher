import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";

export type LinkProps = {
  children: React.ReactNode;
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const Link: React.FC<LinkProps> = (props) => {
  const { children, href, ...rest } = props;
  return (
    <ChakraLink
      as={ReactLink}
      sx={{
        _hover: {
          textDecoration: "underline",
        },
        alignItems: "center",
        color: "blue.500",
        display: "inline-flex",
      }}
      to={href}
      {...rest}
      target={href.startsWith("http") ? "_blank" : "_self"}
    >
      {children}
    </ChakraLink>
  );
};

export default Link;
