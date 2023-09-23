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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement> &
  RecipeVariantProps<typeof buttonRecipe>;

const Button: React.FC<ButtonProps> = ({
  children,
  sx,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <button className={css(buttonRecipe.raw(props), sx)} {...props}>
      {leftIcon && <span className={css({ mr: "4px" })}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={css({ ml: "4px" })}>{rightIcon}</span>}
    </button>
  );
};

export default Button;
