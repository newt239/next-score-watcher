import { useRouter } from "next/router";
import { ReactElement, ReactNode } from "react";

import { Button, SystemStyleObject, ThemingProps } from "@chakra-ui/react";

interface LinkButtonProps {
  href: string;
  variant?: "ghost" | "outline" | "solid" | "link" | "unstyled";
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactElement;
  size?: "xs" | "sm" | "md" | "lg";
  colorScheme?: ThemingProps["colorScheme"];
  sx?: SystemStyleObject;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  variant,
  children,
  icon,
  size,
  disabled,
  colorScheme,
  sx,
}) => {
  const router = useRouter();
  return (
    <Button
      leftIcon={icon}
      onClick={() => router.push(href)}
      variant={variant}
      colorScheme={colorScheme}
      disabled={disabled}
      size={size}
      sx={sx}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
