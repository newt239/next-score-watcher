import { useId } from "react";

import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Switch,
} from "@chakra-ui/react";

type AppOptionSwitchProps = {
  title: string;
  label?: string;
  isChecked: boolean;
  onChange: () => void;
};

const AppOptionSwitch: React.FC<AppOptionSwitchProps> = ({
  title,
  label,
  isChecked,
  onChange,
}) => {
  const formId = useId();
  return (
    <FormControl
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <FormLabel htmlFor={formId} sx={{ flexGrow: 1 }}>
          {title}
        </FormLabel>
        {label && <FormHelperText>{label}</FormHelperText>}
      </Box>
      <Switch id={formId} isChecked={isChecked} onChange={onChange} size="lg" />
    </FormControl>
  );
};

export default AppOptionSwitch;
