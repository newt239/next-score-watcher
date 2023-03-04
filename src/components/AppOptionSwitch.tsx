import { useId } from "react";

import { FormControl, FormLabel, Switch } from "@chakra-ui/react";

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
      <FormLabel htmlFor={formId} sx={{ flexGrow: 1 }}>
        {title}
      </FormLabel>
      <Switch id={formId} size="lg" isChecked={isChecked} onChange={onChange} />
    </FormControl>
  );
};

export default AppOptionSwitch;
