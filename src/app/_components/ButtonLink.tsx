import Link from "next/link";

import { SystemStyleObject } from "@pandacss/dev";

import { buttonRecipe } from "./Button";

import { RecipeVariantProps, css } from "@panda/css";

export type ButtonLinkProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  href: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // JSX.IntrinsicElements["a"]はnext/linkが受け付けない
} & React.HTMLAttributes<HTMLAnchorElement> &
  RecipeVariantProps<typeof buttonRecipe>;

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  sx,
  href,
  leftIcon,
  rightIcon,
  variant,
  size,
  ...props
}) => {
  return (
    <Link
      className={css(buttonRecipe.raw({ size, variant }), sx)}
      href={href}
      {...props}
    >
      {leftIcon && <span className={css({ mr: "4px" })}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={css({ ml: "4px" })}>{rightIcon}</span>}
    </Link>
  );
};

export default ButtonLink;
