import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const TextareaRecipe = cva({
  base: {
    _focusVisible: {
      borderColor: "emerald.500",
      boxShadow: "#10b981 0px 0px 0px 1px",
      outline: "none",
    },
    borderColor: "gray.300",
    borderRadius: "md",
    borderWidth: "2px",
    display: "block",
    transition: "all 0.2s ease",
  },
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      lg: { fontSize: "24px", px: "8px", py: "6px" },
      md: { fontSize: "18px", px: "8px", py: "6px" },
      sm: { fontSize: "12px", px: "8px", py: "6px" },
      xl: { borderRadius: "full", fontSize: "32px", px: "20px", py: "12px" },
    },
  },
});

export type TextareaProps = {
  sx?: SystemStyleObject;
  variants?: RecipeVariantProps<typeof TextareaRecipe>;
} & JSX.IntrinsicElements["textarea"];

const Textarea: React.FC<TextareaProps> = ({ sx, variants, ...props }) => {
  return (
    <textarea className={css(TextareaRecipe.raw(variants), sx)} {...props} />
  );
};

export default Textarea;
