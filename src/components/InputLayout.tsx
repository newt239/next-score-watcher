import React from "react";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  SystemStyleObject,
  VStack,
} from "@chakra-ui/react";

type InputLayoutProps = {
  id?: string;
  label: React.ReactNode;
  helperText?: React.ReactNode;
  children: React.ReactNode;
  sx?: SystemStyleObject;
};

const InputLayout: React.FC<InputLayoutProps> = ({
  id,
  label,
  helperText,
  children,
  sx,
}) => {
  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: ["column", "row"],
        justifyContent: "space-between",
        alignItems: ["stretch", "center"],
        gap: "0.5rem",
        borderStyle: "solid",
        borderColor: "gray.200",
        borderBottomWidth: 1,
        p: 2,
        transition: "all ease 0.2s",
        _dark: {
          borderColor: "gray.700",
        },
        ...sx,
      }}
    >
      <VStack align="stretch" gap={0}>
        <FormLabel htmlFor={id} m={0}>
          {label}
        </FormLabel>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </VStack>
      {children}
    </FormControl>
  );
};

export default InputLayout;
