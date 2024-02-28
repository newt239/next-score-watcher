import { SystemStyleObject } from "@pandacss/dev";

import { css, cva } from "@panda/css";

export const FormControlRecipe = cva({
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
