import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const buttonRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: "1px",
    borderColor: "transparent",
    width: "fit-content",
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
      subtle: {
        color: "emerald.500",
        _hover: {
          bgColor: "neutral.100",
        },
      },
    },
    size: {
      sm: { px: "8px", py: "4px", fontSize: "12px", borderRadius: "4px" },
      md: { px: "8px", py: "6px", fontSize: "18px", borderRadius: "8px" },
      lg: { px: "12px", py: "8px", fontSize: "24px", borderRadius: "12px" },
      xl: { px: "20px", py: "12px", fontSize: "32px", borderRadius: "full" },
    },
    color: {
      black: { color: "black" },
      white: { color: "white" },
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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & JSX.IntrinsicElements["button"] &
  RecipeVariantProps<typeof buttonRecipe>;

const Button: React.FC<ButtonProps> = ({
  children,
  sx,
  leftIcon,
  rightIcon,
  variant,
  size,
  ...props
}) => {
  return (
    <button className={css(buttonRecipe.raw({ variant, size }), sx)} {...props}>
      {leftIcon && <span className={css({ mr: "4px" })}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={css({ ml: "4px" })}>{rightIcon}</span>}
    </button>
  );
};

export default Button;
