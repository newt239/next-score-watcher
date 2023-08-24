import { useId } from "react";

import {
  NumberInput as ChakraNumberInput,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  SystemStyleObject,
} from "@chakra-ui/react";

type NumberInputProps = {
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange?: (s: string, n: number) => void;
  value: number;
  sx: SystemStyleObject;
};

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  min = 0,
  max = 100,
  disabled,
  onChange,
  value,
  sx,
}) => {
  const id = useId();

  return (
    <FormControl sx={sx}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <ChakraNumberInput
        id={id}
        isDisabled={disabled}
        max={max}
        min={min}
        onChange={onChange}
        value={value}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </ChakraNumberInput>
    </FormControl>
  );
};

export default NumberInput;
