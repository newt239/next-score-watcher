import { Link } from "react-router-dom";

import { SystemStyleObject } from "@pandacss/dev";

import { buttonRecipe } from "./Button";

import { RecipeVariantProps, css, cx } from "@panda/css";

export type ButtonLinkProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  href: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // JSX.IntrinsicElements["a"]はnext/linkが受け付けない
} & React.HTMLAttributes<HTMLAnchorElement> &
  RecipeVariantProps<typeof buttonRecipe>;

const ButtonLink: React.FC<ButtonLinkProps> = (props) => {
  const { children, href, leftIcon, rightIcon, ...rest } = props;
  const [componentProps, cssProps] = buttonRecipe.splitVariantProps(rest);
  return (
    <Link
      className={cx(buttonRecipe(componentProps), css(cssProps))}
      to={href}
      {...props}
    >
      {leftIcon && <span className={css({ mr: "4px" })}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={css({ ml: "4px" })}>{rightIcon}</span>}
    </Link>
  );
};

export default ButtonLink;
