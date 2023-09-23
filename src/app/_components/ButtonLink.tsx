import Link from "next/link";

import { SystemStyleObject } from "@pandacss/dev";

import { buttonRecipe } from "./Button";

import { RecipeVariantProps, css } from "@panda/css";

export type ButtonLinkProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  variants?: RecipeVariantProps<typeof buttonRecipe>;
  href: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // JSX.IntrinsicElements["a"]はnext/linkが受け付けない
} & React.HTMLAttributes<HTMLAnchorElement>;

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  sx,
  variants,
  href,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <Link
      className={css(buttonRecipe.raw(variants), sx)}
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
