import { RecipeVariantProps, css, cva, cx } from "@panda/css";
import { SystemStyleObject } from "@panda/types";

export const NumberInputRecipe = cva({
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

export type NumberInputProps = {
  sx?: SystemStyleObject;
} & JSX.IntrinsicElements["input"] &
  RecipeVariantProps<typeof NumberInputRecipe>;

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const { sx, ...rest } = props;
  const [componentProps, restProps] = NumberInputRecipe.splitVariantProps(rest);
  return (
    <input
      className={cx(NumberInputRecipe(componentProps), css(sx))}
      type="number"
      {...props}
    />
  );
};

export default NumberInput;
