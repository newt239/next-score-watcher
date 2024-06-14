import { Dispatch, SetStateAction } from "react";

import {
  ActionIcon,
  Popover,
  Radio,
  Stack,
  useComputedColorScheme,
} from "@mantine/core";
import { Edit } from "tabler-icons-react";

import { States } from "@/utils/types";

type PlayerColorConfigProps = {
  colorState: string | undefined;
  editableState: States;
  setEditableState: Dispatch<SetStateAction<States>>;
};

const PlayerColorConfig: React.FC<PlayerColorConfigProps> = ({
  colorState,
  editableState,
  setEditableState,
}) => {
  const colorScheme = useComputedColorScheme("light");

  return (
    <Popover width={200} withArrow shadow="md">
      <Popover.Target>
        <ActionIcon
          aria-label="プレイヤーの状態を上書きします"
          color={colorState && (colorScheme === "light" ? "white" : "gray.8")}
          variant="subtle"
        >
          <Edit />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
        className="w-auto"
        style={{
          color: colorScheme === "light" ? "black" : "white",
          backgroundColor: colorScheme === "light" ? "white" : "gray.8",
        }}
      >
        <h4>背景色を変更</h4>
        <Radio.Group
          onChange={(newState) => setEditableState(newState as States)}
          value={editableState}
        >
          <Stack>
            <Radio value="playing">デフォルト</Radio>
            <Radio value="win">赤</Radio>
            <Radio value="lose">青</Radio>
          </Stack>
        </Radio.Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PlayerColorConfig;
