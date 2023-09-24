import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const NumberInputRecipe = cva({
  base: {
    display: "block",
    borderWidth: "2px",
    borderRadius: "md",
    borderColor: "gray.300",
    width: "100%",
    transition: "all 0.2s ease",
    _focusVisible: {
      outline: "none",
      borderColor: "emerald.500",
      boxShadow: "#10b981 0px 0px 0px 1px",
    },
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
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

export type NumberInputProps = {
  sx?: SystemStyleObject;
  variants?: RecipeVariantProps<typeof NumberInputRecipe>;
} & JSX.IntrinsicElements["input"];

const NumberInput: React.FC<NumberInputProps> = ({
  sx,
  variants,
  ...props
}) => {
  return (
    <input
      className={css(NumberInputRecipe.raw(variants), sx)}
      type="number"
      {...props}
    />
  );
};

export default NumberInput;
