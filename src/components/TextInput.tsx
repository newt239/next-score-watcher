import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const TextInputRecipe = cva({
  base: {
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.5,
    },
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
    width: "100%",
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

export type TextInputProps = {
  sx?: SystemStyleObject;
  variants?: RecipeVariantProps<typeof TextInputRecipe>;
} & JSX.IntrinsicElements["input"];

const TextInput: React.FC<TextInputProps> = ({ sx, variants, ...props }) => {
  return (
    <input
      className={css(TextInputRecipe.raw(variants), sx)}
      type="text"
      {...props}
    />
  );
};

export default TextInput;
