import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const buttonRecipe = cva({
  base: {
    display: "inline-flex",
    width: "fit-content",
    borderWidth: "1px",
    borderColor: "transparent",
    borderRadius: "md",
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
} & React.HTMLAttributes<HTMLButtonElement> &
  RecipeVariantProps<typeof buttonRecipe>;

const Button: React.FC<ButtonProps> = ({ children, sx, ...props }) => {
  return (
    <button className={css(buttonRecipe.raw(props), sx)} {...props}>
      {children}
    </button>
  );
};

export default Button;
