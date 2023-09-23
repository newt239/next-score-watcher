import Link from "next/link";

import { SystemStyleObject } from "@pandacss/dev";

import { buttonRecipe } from "./Button";

import { RecipeVariantProps, css } from "@panda/css";

export type ButtonLinkProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  variants?: RecipeVariantProps<typeof buttonRecipe>;
  href: string;
  // JSX.IntrinsicElements["a"]はnext/linkが受け付けない
} & React.HTMLAttributes<HTMLAnchorElement>;

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  sx,
  variants,
  href,
  ...props
}) => {
  return (
    <Link
      className={css(buttonRecipe.raw(variants), sx)}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
