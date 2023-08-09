import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  VStack,
} from "@chakra-ui/react";

type InputLayoutProps = {
  id?: string;
  label: string;
  helperText?: React.ReactNode;
  simple?: boolean;
  vertical?: boolean;
  children: React.ReactNode;
};

const InputLayout: React.FC<InputLayoutProps> = ({
  id,
  label,
  helperText,
  simple = false,
  vertical = false,
  children,
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
        _dark: {
          borderColor: "gray.700",
        },
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
