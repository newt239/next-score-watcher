import { useId } from "react";

import { FormHelperText, Switch } from "@chakra-ui/react";

import InputLayout from "#/components/InputLayout";

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
    <InputLayout
      helperText={label && <FormHelperText>{label}</FormHelperText>}
      id={formId}
      label={title}
    >
      <Switch id={formId} isChecked={isChecked} onChange={onChange} size="lg" />
    </InputLayout>
  );
};

export default AppOptionSwitch;
