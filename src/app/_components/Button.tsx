import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const buttonRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    borderWidth: "1px",
    borderColor: "transparent",
    borderRadius: "md",
    cursor: "pointer",
    transition: "all 0.2s ease",
    _disabled: {
      backgroundColor: "gray.300",
      color: "white",
      cursor: "not-allowed",
      _hover: {
        backgroundColor: "gray.300",
      },
    },
  },
  variants: {
    variant: {
      solid: {
        bgColor: "emerald.500",
        color: "white",
        _hover: {
          bgColor: "emerald.600",
        },
      },
      outline: { borderColor: "emerald.500" },
      ghost: {
        color: "emerald.500",
        _hover: {
          bgColor: "neutral.200",
        },
      },
    },
    size: {
      sm: { px: "8px", py: "6px", fontSize: "12px" },
      md: { px: "8px", py: "6px", fontSize: "18px" },
      lg: { px: "8px", py: "6px", fontSize: "24px" },
      xl: { px: "20px", py: "12px", fontSize: "32px", borderRadius: "full" },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

export type ButtonProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  variants?: RecipeVariantProps<typeof buttonRecipe>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & JSX.IntrinsicElements["button"];

const Button: React.FC<ButtonProps> = ({
  children,
  sx,
  leftIcon,
  rightIcon,
  variants,
  ...props
}) => {
  return (
    <button className={css(buttonRecipe.raw(variants), sx)} {...props}>
      {leftIcon && <span className={css({ mr: "4px" })}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={css({ ml: "4px" })}>{rightIcon}</span>}
    </button>
  );
};

export default Button;
