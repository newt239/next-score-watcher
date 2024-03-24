import { SystemStyleObject } from "@pandacss/dev";

import { css, cva, cx } from "@panda/css";

export const formControlRecipe = cva({
  base: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    md: {
      alignItems: "stretch",
      flexDirection: "row",
    },
  },
});

export type FormControlProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  label: React.ReactNode;
  helperText?: string;
} & JSX.IntrinsicElements["fieldset"];

const FormControl: React.FC<FormControlProps> = (props) => {
  const { children, label, helperText, ...rest } = props;
  const [componentProps, cssProps] = formControlRecipe.splitVariantProps(rest);
  return (
    <fieldset
      className={cx(formControlRecipe(componentProps), css(cssProps))}
      {...props}
    >
      <legend>{label}</legend>
      {children}
      {helperText && (
        <p
          className={css({
            color: "gray.500",
            fontSize: "12px",
          })}
        >
          {helperText}
        </p>
      )}
    </fieldset>
  );
};

export default FormControl;
