import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const switchRecipe = cva({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    width: "fit-content",
    cursor: "pointer",
    my: "8px",
  },
  variants: {
    size: {
      sm: { height: "0.75rem" },
      md: { height: "1rem" },
      lg: { height: "1.25rem" },
    },
    knob: {
      true: { translateX: "0.75rem" },
      false: { translateX: "0" },
    },
  },
  defaultVariants: {
    size: "md",
    knob: false,
  },
});

export type SwitchProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  variants?: RecipeVariantProps<typeof switchRecipe>;
} & JSX.IntrinsicElements["input"];

const Switch: React.FC<SwitchProps> = ({
  children,
  sx,
  variants,
  ...props
}) => {
  return (
    <label className={css(switchRecipe.raw(variants), sx)}>
      <input type="checkbox" {...props} />
      <span>{children}</span>
    </label>
  );
};

export default Switch;
