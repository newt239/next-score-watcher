"use client";

import type { Dispatch, SetStateAction } from "react";

import { ActionIcon, Popover, Radio, useComputedColorScheme } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

import type { States } from "@/utils/types";

type Props = {
  colorState: string | undefined;
  editableState: States;
  setEditableState: Dispatch<SetStateAction<States>>;
};

const PlayerColorConfig: React.FC<Props> = ({ colorState, editableState, setEditableState }) => {
  const colorScheme = useComputedColorScheme("light");

  return (
    <Popover width={200} withArrow shadow="md">
      <Popover.Target>
        <ActionIcon
          aria-label="プレイヤーの状態を上書きします"
          color={colorState && (colorScheme === "light" ? "white" : "gray.8")}
          variant="subtle"
        >
          <IconEdit />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
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
          <Radio value="playing" label="デフォルト" />
          <Radio value="win" label="赤" />
          <Radio value="lose" label="青" />
        </Radio.Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PlayerColorConfig;
