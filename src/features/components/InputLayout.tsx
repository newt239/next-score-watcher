import React from "react";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  SystemStyleObject,
  VStack,
} from "@chakra-ui/react";

type InputLayoutProps = {
  id?: string;
  label: React.ReactNode;
  labelStyle?: SystemStyleObject;
  helperText?: React.ReactNode;
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
      as={HStack}
      sx={{
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
      }}
    >
      <VStack align="stretch" gap={0}>
        <FormLabel htmlFor={id} m={0} sx={labelStyle}>
          {label}
        </FormLabel>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </VStack>
      {children}
    </FormControl>
  );
};

export default InputLayout;
