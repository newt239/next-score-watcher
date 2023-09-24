import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const switchRecipe = cva({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    height: "1rem", // デフォルトの高さ
    cursor: "pointer",
  },
  variants: {
    size: {
      sm: { height: "0.75rem" },
      md: { height: "1rem" },
      lg: { height: "1.25rem" },
    },
    checked: {
      true: { bgColor: "emerald.500" },
      false: { bgColor: "gray.300" },
    },
    knob: {
      true: { translateX: "0.75rem" },
      false: { translateX: "0" },
    },
  },
  defaultVariants: {
    size: "md",
    checked: false,
    knob: false,
  },
});

export type SwitchProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  checked: boolean;
  variants?: RecipeVariantProps<typeof switchRecipe>;
} & JSX.IntrinsicElements["input"];

const Switch: React.FC<SwitchProps> = ({
  children,
  sx,
  checked,
  variants,
  ...props
}) => {
  return (
    <label className={css(switchRecipe.raw(variants), sx)}>
      <input checked={checked} type="checkbox" {...props} />
      <span>{children}</span>
    </label>
  );
};

export default Switch;
