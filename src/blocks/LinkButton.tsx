import { useRouter } from "next/router";
import { ReactNode } from "react";

import { Button, SystemStyleObject } from "@chakra-ui/react";

interface LinkButtonProps {
  href: string;
  variant?: "ghost" | "outline" | "solid" | "link" | "unstyled";
  children: ReactNode;
  disabled?: boolean;
  sx?: SystemStyleObject;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  variant,
  children,
  disabled,
  sx,
}) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(href)}
      variant={variant}
      colorScheme="blue"
      disabled={disabled}
      sx={sx}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
