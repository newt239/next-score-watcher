import { Dispatch, SetStateAction } from "react";

import { Popover, RadioGroup } from "@ark-ui/react";
import { Edit, Radio } from "tabler-icons-react";

import Button from "#/app/_components/Button";
import { States } from "#/utils/types";
import { css } from "@panda/css";

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
  return (
    <div
      className={css({
        lg: {
          margin: "auto",
        },
      })}
    >
      <Popover.Root>
        <Popover.Trigger>
          <Button
            aria-label="プレイヤーの状態を上書きします"
            className={css({
              color: "white",
            })}
            size="sm"
            variant="subtle"
          >
            <Edit />
          </Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Title>背景色を変更</Popover.Title>
            <Popover.Description>
              <RadioGroup
                onChange={(newState: States) => setEditableState(newState)}
                value={editableState}
              >
                <div>
                  <Radio value="playing">デフォルト</Radio>
                  <Radio value="win">赤</Radio>
                  <Radio value="lose">青</Radio>
                </div>
              </RadioGroup>
            </Popover.Description>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    </div>
  );
};

export default PlayerColorConfig;
