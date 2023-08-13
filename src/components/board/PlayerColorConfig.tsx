import { Dispatch, SetStateAction } from "react";

import {
  Box,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { Edit } from "tabler-icons-react";

import useDeviceWidth from "#/hooks/useDeviceWidth";
import { verticalViewAtom } from "#/utils/jotai";
import { States } from "#/utils/types";

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
  const { colorMode } = useColorMode();
  const isDesktop = useDeviceWidth();
  const isVerticalView = useAtomValue(verticalViewAtom);

  return (
    <Box
      sx={{
        margin: !isVerticalView && isDesktop ? "auto" : undefined,
      }}
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
          sx={{
            w: "auto",
            color: "black",
            _dark: {
              color: "white",
              bgColor: "gray.800",
            },
          }}
        >
          <PopoverHeader>背景色を変更</PopoverHeader>
          <PopoverBody>
            <RadioGroup
              onChange={(newState: States) => setEditableState(newState)}
              value={editableState}
            >
              <Stack direction="row" spacing={5}>
                <Radio value="playing">デフォルト</Radio>
                <Radio value="win">赤</Radio>
                <Radio value="lose">青</Radio>
              </Stack>
            </RadioGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default PlayerColorConfig;
