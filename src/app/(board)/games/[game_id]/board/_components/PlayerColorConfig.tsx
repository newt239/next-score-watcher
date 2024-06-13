import { Dispatch, SetStateAction } from "react";

import { ActionIcon, Popover, Radio, Stack } from "@mantine/core";
import { Edit } from "tabler-icons-react";

import { States } from "@/utils/types";

type PlayerColorConfigProps = {
  colorState: string | undefined;
  editableState: States;
  setEditableState: Dispatch<SetStateAction<States>>;
  isVerticalView: boolean;
};

const PlayerColorConfig: React.FC<PlayerColorConfigProps> = ({
  colorState,
  editableState,
  setEditableState,
  isVerticalView,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Popover width={200} withArrow shadow="md">
      <Popover.Target>
        <ActionIcon
          aria-label="プレイヤーの状態を上書きします"
          color={colorState && (colorMode === "light" ? "white" : "gray.800")}
          variant="subtle"
        >
          <Edit />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
        style={{
          w: "auto",
          color: "black",
          _dark: {
            color: "white",
            bgColor: "gray.800",
          },
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
