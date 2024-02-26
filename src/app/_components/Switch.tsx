import { Switch as ArkSwitch } from "@ark-ui/react";
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
} & React.ComponentProps<typeof ArkSwitch.Root>;

const Switch: React.FC<SwitchProps> = ({
  children,
  sx,
  variants,
  ...props
}) => {
  return (
    <ArkSwitch.Root className={css(switchRecipe.raw(variants), sx)} {...props}>
      <ArkSwitch.Control
        className={css({
          w: "32px",
          borderRadius: "full",
          backgroundColor: "gray.300",
          _checked: {
            backgroundColor: "emerald.500",
          },
        })}
      >
        <ArkSwitch.Thumb
          className={css({
            display: "block",
            w: "16px",
            h: "16px",
            p: "2px",
            backgroundColor: "black",
            borderRadius: "full",
            _checked: {
              backgroundColor: "white",
            },
          })}
        />
      </ArkSwitch.Control>
      <ArkSwitch.Label>{children}</ArkSwitch.Label>
    </ArkSwitch.Root>
  );
};

export default Switch;
