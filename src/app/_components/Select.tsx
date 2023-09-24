import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const selectRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    borderWidth: "1px",
    borderColor: "gray.300",
    borderRadius: "md",
    cursor: "pointer",
    position: "relative",
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
    size: {
      sm: { px: "8px", py: "6px", fontSize: "12px" },
      md: { px: "8px", py: "6px", fontSize: "18px" },
      lg: { px: "8px", py: "6px", fontSize: "24px" },
      xl: { px: "20px", py: "12px", fontSize: "32px", borderRadius: "full" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type SelectProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  variants?: RecipeVariantProps<typeof selectRecipe>;
} & JSX.IntrinsicElements["select"];

const Select: React.FC<SelectProps> = ({
  children,
  sx,
  variants,
  ...props
}) => {
  return (
    <select className={css(selectRecipe.raw(variants), sx)} {...props}>
      {children}
    </select>
  );
};

export default Select;
