import { Link } from "react-router-dom";

import { buttonRecipe } from "./Button";

import { RecipeVariantProps, css, cx } from "@panda/css";
import { SystemStyleObject } from "@panda/types";

export type ButtonLinkProps = {
  children: React.ReactNode;
  href: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean; // TODO: disabledのスタイルを実装
  sx?: SystemStyleObject;
  // JSX.IntrinsicElements["a"]はnext/linkが受け付けない
} & React.HTMLAttributes<HTMLAnchorElement> &
  RecipeVariantProps<typeof buttonRecipe>;

const ButtonLink: React.FC<ButtonLinkProps> = (props) => {
  const { children, href, leftIcon, rightIcon, disabled, sx, ...rest } = props;
  const [componentProps, restProps] = buttonRecipe.splitVariantProps(rest);
  return (
    <Link
      className={cx(buttonRecipe(componentProps), css(sx))}
      to={href}
      {...restProps}
    >
      {leftIcon && <span className={css({ mr: "4px" })}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={css({ ml: "4px" })}>{rightIcon}</span>}
    </Link>
  );
};

export default ButtonLink;
