import { Dispatch, SetStateAction } from "react";

import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  useColorMode,
} from "@chakra-ui/react";
import { Edit } from "tabler-icons-react";

import useDeviceWidth from "#/features/hooks/useDeviceWidth";
import { States } from "#/utils/types";
import { css } from "@panda/css";

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
  const isDesktop = useDeviceWidth();

  return (
    <div
      className={css({
        margin: !isVerticalView && isDesktop ? "auto" : undefined,
      })}
    >
      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label="プレイヤーの状態を上書きします"
            color={colorState && (colorMode === "light" ? "white" : "gray.800")}
            colorScheme={colorState}
            icon={<Edit />}
            size="xs"
            variant="ghost"
          />
        </PopoverTrigger>
        <PopoverContent
          className={css({
            w: "auto",
            color: "black",
            _dark: {
              color: "white",
              bgColor: "gray.800",
            },
          })}
        >
          <PopoverHeader>背景色を変更</PopoverHeader>
          <PopoverBody>
            <RadioGroup
              onChange={(newState: States) => setEditableState(newState)}
              value={editableState}
            >
              <div
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                })}
              >
                <Radio value="playing">デフォルト</Radio>
                <Radio value="win">赤</Radio>
                <Radio value="lose">青</Radio>
              </div>
            </RadioGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PlayerColorConfig;
