import { Dispatch, SetStateAction } from "react";

import {
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  RadioGroup,
  useColorMode,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { Edit } from "tabler-icons-react";

import { States } from "#/utils/db";
import { colors } from "#/utils/theme";

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
            size="xs"
            variant="ghost"
            colorScheme={colorState}
            color={
              colorState && (colorMode === "light" ? "white" : colors.gray[800])
            }
            icon={<Edit />}
            aria-label="override player state"
          />
        </PopoverTrigger>
        <PopoverContent
          sx={{ color: colorMode === "light" ? "black" : "white" }}
        >
          <PopoverArrow />
          <PopoverHeader>背景色を変更</PopoverHeader>
          <PopoverBody>
            <RadioGroup
              value={editableState}
              onChange={(newState: States) => setEditableState(newState)}
            >
              <Stack spacing={5} direction="row">
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
