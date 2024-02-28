import { Switch as ArkSwitch } from "@ark-ui/react";
import { SystemStyleObject } from "@pandacss/dev";

import { RecipeVariantProps, css, cva } from "@panda/css";

export const switchRecipe = cva({
  base: {
    alignItems: "center",
    cursor: "pointer",
    display: "inline-flex",
    gap: "8px",
    my: "8px",
    position: "relative",
    width: "fit-content",
  },
  defaultVariants: {
    knob: false,
    size: "md",
  },
  variants: {
    knob: {
      false: { translateX: "0" },
      true: { translateX: "0.75rem" },
    },
    size: {
      lg: { height: "1.25rem" },
      md: { height: "1rem" },
      sm: { height: "0.75rem" },
    },
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
          _checked: {
            backgroundColor: "emerald.500",
          },
          backgroundColor: "gray.300",
          borderRadius: "full",
          w: "32px",
        })}
      >
        <ArkSwitch.Thumb
          className={css({
            _checked: {
              backgroundColor: "white",
            },
            backgroundColor: "black",
            borderRadius: "full",
            display: "block",
            h: "16px",
            p: "2px",
            w: "16px",
          })}
        />
      </ArkSwitch.Control>
      <ArkSwitch.Label>{children}</ArkSwitch.Label>
    </ArkSwitch.Root>
  );
};

export default Switch;
