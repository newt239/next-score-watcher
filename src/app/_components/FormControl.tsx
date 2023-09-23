import { SystemStyleObject } from "@pandacss/dev";

import { css, cva } from "@panda/css";

export const FormControlRecipe = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    md: {
      flexDirection: "row",
      alignItems: "stretch",
    },
  },
});

export type FormControlProps = {
  children: React.ReactNode;
  sx?: SystemStyleObject;
  label: React.ReactNode;
  helperText?: string;
} & JSX.IntrinsicElements["fieldset"];

const FormControl: React.FC<FormControlProps> = ({
  children,
  sx,
  label,
  helperText,
  ...props
}) => {
  return (
    <fieldset className={css(FormControlRecipe.raw(), sx)} {...props}>
      <legend>{label}</legend>
      {children}
      {helperText && (
        <p
          className={css({
            fontSize: "12px",
            color: "gray.500",
          })}
        >
          {helperText}
        </p>
      )}
    </fieldset>
  );
};

export default FormControl;
