import { FormControl, FormLabel, HStack } from "@chakra-ui/react";

type InputLayoutProps = {
  label: string;
  simple?: boolean;
  children: React.ReactNode;
};

const InputLayout: React.FC<InputLayoutProps> = ({
  label,
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
      <FormLabel m={0}>{label}</FormLabel>
      {children}
    </FormControl>
  );
};

export default InputLayout;
