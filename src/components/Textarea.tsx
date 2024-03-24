import { RecipeVariantProps, css, cva, cx } from "@panda/css";
import { SystemStyleObject } from "@panda/types";

export const textareaRecipe = cva({
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
} & JSX.IntrinsicElements["textarea"] &
  RecipeVariantProps<typeof textareaRecipe>;

const Textarea: React.FC<TextareaProps> = (props) => {
  const { sx, ...rest } = props;
  const [componentProps, restProps] = textareaRecipe.splitVariantProps(rest);
  return (
    <textarea
      className={cx(textareaRecipe(componentProps), css(sx))}
      {...restProps}
    />
  );
};

export default Textarea;
