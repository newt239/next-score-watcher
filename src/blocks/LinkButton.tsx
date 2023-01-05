import { useRouter } from "next/router";
import { ReactElement, ReactNode } from "react";

import { Button, SystemStyleObject } from "@chakra-ui/react";

interface LinkButtonProps {
  href: string;
  variant?: "ghost" | "outline" | "solid" | "link" | "unstyled";
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactElement;
  size?: "xs" | "sm" | "md" | "lg";
  sx?: SystemStyleObject;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  variant,
  children,
  icon,
  size,
  disabled,
  sx,
}) => {
  const router = useRouter();
  return (
    <Button
      leftIcon={icon}
      onClick={() => router.push(href)}
      variant={variant}
      colorScheme="blue"
      disabled={disabled}
      size={size}
      sx={sx}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
