import { RecipeVariantProps, css, cva, cx } from "@panda/css";

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
    color: "emerald.500",
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
  variants: {
    size: {
      sm: { borderRadius: "4px", fontSize: "12px", px: "8px", py: "2px" },
      md: { borderRadius: "8px", fontSize: "18px", px: "12px", py: "4px" },
      lg: { borderRadius: "12px", fontSize: "24px", px: "12px", py: "8px" },
      xl: { borderRadius: "18px", fontSize: "32px", px: "24px", py: "12px" },
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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  RecipeVariantProps<typeof buttonRecipe>;

const Button = (props: ButtonProps) => {
  // https://panda-css.com/docs/overview/faq#how-do-i-split-recipe-props-from-the-rest
  const { children, leftIcon, rightIcon, ...rest } = props;
  const [componentProps, cssProps] = buttonRecipe.splitVariantProps(rest);
  return (
    <button
      className={cx(buttonRecipe(componentProps), css(cssProps))}
      {...props}
    >
      {leftIcon && <span className={css({ mr: "4px" })}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={css({ ml: "4px" })}>{rightIcon}</span>}
    </button>
  );
};

export default Button;
