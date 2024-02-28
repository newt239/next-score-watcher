import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const buttonRecipe = cva({
  base: {
    _disabled: {
      backgroundColor: "gray.300",
      _hover: {
        backgroundColor: "gray.300",
      },
      color: "white",
      cursor: "not-allowed",
    },
    alignItems: "center",
    borderColor: "transparent",
    borderWidth: "1px",
    cursor: "pointer",
    display: "inline-flex",
    justifyContent: "center",
    transition: "all 0.2s ease",
    width: "fit-content",
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
  variants: {
    color: {
      black: { color: "black" },
      white: { color: "white" },
    },
    size: {
      lg: { borderRadius: "12px", fontSize: "24px", px: "12px", py: "8px" },
      md: { borderRadius: "8px", fontSize: "18px", px: "8px", py: "6px" },
      sm: { borderRadius: "4px", fontSize: "12px", px: "8px", py: "4px" },
      xl: { borderRadius: "full", fontSize: "32px", px: "20px", py: "12px" },
    },
    variant: {
      outline: { borderColor: "emerald.500" },
      solid: {
        _hover: {
          bgColor: "emerald.600",
        },
        bgColor: "emerald.500",
        color: "white",
      },
      subtle: {
        _hover: {
          bgColor: "neutral.100",
        },
        color: "emerald.500",
      },
    },
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
    <button className={css(buttonRecipe.raw({ size, variant }), sx)} {...props}>
      {leftIcon && <span className={css({ mr: "4px" })}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={css({ ml: "4px" })}>{rightIcon}</span>}
    </button>
  );
};

export default Button;
