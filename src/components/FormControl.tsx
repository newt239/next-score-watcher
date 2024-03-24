import { css, cva, cx } from "@panda/css";
import { SystemStyleObject } from "@panda/types";

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
  label: React.ReactNode;
  helperText?: string;
  sx?: SystemStyleObject;
} & JSX.IntrinsicElements["fieldset"];

const FormControl: React.FC<FormControlProps> = (props) => {
  const { children, label, helperText, sx, ...rest } = props;
  const [componentProps, restProps] = formControlRecipe.splitVariantProps(rest);
  return (
    <fieldset
      className={cx(formControlRecipe(componentProps), css(sx))}
      {...restProps}
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
