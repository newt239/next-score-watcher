import { SystemStyleObject } from "@pandacss/dev";

import FormControl from "#/app/_components/FormControl";
import { css } from "@panda/css";

type InputLayoutProps = {
  id?: string;
  label: React.ReactNode;
  labelStyle?: SystemStyleObject;
  helperText?: string;
  simple?: boolean;
  vertical?: boolean;
  children: React.ReactNode;
  wrapperStyle?: SystemStyleObject;
};

const InputLayout: React.FC<InputLayoutProps> = ({
  id,
  label,
  labelStyle,
  helperText,
  simple = false,
  vertical = false,
  children,
  wrapperStyle,
}) => {
  return (
    <FormControl
      className={css({
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        justifyContent: "space-between",
        alignItems: vertical ? "stretch" : "center",
        borderStyle: "solid",
        borderColor: "gray.200",
        borderBottomWidth: simple ? 0 : 1,
        p: 2,
        transition: "all ease 0.2s",
        _dark: {
          borderColor: "gray.700",
        },
        ...wrapperStyle,
      })}
      helperText={helperText}
      label={label}
    >
      {children}
    </FormControl>
  );
};

export default InputLayout;
