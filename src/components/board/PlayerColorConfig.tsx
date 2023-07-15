import { Dispatch, SetStateAction } from "react";

import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  theme,
  useColorMode,
} from "@chakra-ui/react";
import { Edit } from "tabler-icons-react";

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

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label="override player state"
            color={
              colorState &&
              (colorMode === "light" ? "white" : theme.colors.gray[800])
            }
            colorScheme={colorState}
            icon={<Edit />}
            size="xs"
            variant="ghost"
          />
        </PopoverTrigger>
        <PopoverContent
          sx={{ color: colorMode === "light" ? "black" : "white" }}
        >
          <PopoverArrow />
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
    </>
  );
};

export default PlayerColorConfig;
