import { useId } from "react";

import { FormHelperText, Switch } from "@chakra-ui/react";

import InputLayout from "~/components/InputLayout";
import { recordEvent } from "~/utils/ga4";

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
      sx={{ flexDirection: "row" }}
    >
      <Switch
        id={formId}
        isChecked={isChecked}
        onChange={() => {
          recordEvent({
            action: `switch_${title.toLowerCase().replace(/\s/g, "_")}`,
            category: "engagement",
          });
          onChange();
        }}
        size="lg"
      />
    </InputLayout>
  );
};

export default AppOptionSwitch;
