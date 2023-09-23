import Link from "next/link";

import { SystemStyleObject } from "@pandacss/dev";

import { buttonRecipe } from "./Button";

import { RecipeVariantProps, css } from "@panda/css";

export type ButtonLinkProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement> &
  RecipeVariantProps<typeof buttonRecipe>;

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  sx,
  href,
  ...props
}) => {
  return (
    <Link className={css(buttonRecipe.raw(props), sx)} href={href} {...props}>
      {children}
    </Link>
  );
};

export default ButtonLink;
