import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  VStack,
} from "@chakra-ui/react";

type InputLayoutProps = {
  label: string;
  helperText?: React.ReactNode;
  simple?: boolean;
  children: React.ReactNode;
};

const InputLayout: React.FC<InputLayoutProps> = ({
  label,
  helperText,
  simple = false,
  children,
}) => {
  return (
    <FormControl
      as={HStack}
      sx={{
        justifyContent: "space-between",
        borderStyle: "solid",
        borderColor: "gray.700",
        borderBottomWidth: simple ? 0 : 1,
        p: 2,
      }}
    >
      <VStack align="stretch">
        <FormLabel m={0}>{label}</FormLabel>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </VStack>
      {children}
    </FormControl>
  );
};

export default InputLayout;
