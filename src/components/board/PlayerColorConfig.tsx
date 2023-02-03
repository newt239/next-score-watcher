import { Dispatch, SetStateAction } from "react";

import {
  Box,
  Popover,
  PopoverTrigger,
  IconButton,
  theme,
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
    <Box sx={{ color: colorMode === "light" ? "black" : "white" }}>
      <Popover>
        <PopoverTrigger>
          <IconButton
            size="sm"
            variant="ghost"
            colorScheme={colorState}
            color={
              colorState &&
              (colorMode === "light" ? "white" : theme.colors.gray[800])
            }
            icon={<Edit />}
            aria-label="override player state"
          />
        </PopoverTrigger>
        <PopoverContent>
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
    </Box>
  );
};

export default PlayerColorConfig;
