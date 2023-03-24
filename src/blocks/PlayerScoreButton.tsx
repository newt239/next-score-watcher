import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  theme,
  useColorMode,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";

type PlayerScoreButtonProps = {
  color: "red" | "blue" | "green" | "win" | "lose" | "playing";
  children: string | number;
  filled?: boolean;
  compact?: boolean;
  game_id: string;
  player_id: string;
  editable: boolean;
  disabled?: boolean;
};

const PlayerScoreButton: React.FC<PlayerScoreButtonProps> = ({
  color,
  children,
  filled = false,
  compact = false,
  game_id,
  player_id,
  editable,
  disabled,
}) => {
  const { colorMode } = useColorMode();
  const desktop = useDeviceWidth();

  const defaultColor = colorMode === "light" ? "white" : theme.colors.gray[800];
  const variantColor = ["red", "win"].includes(color)
    ? theme.colors.red[colorMode === "light" ? 600 : 300]
    : ["blue", "lose"].includes(color)
    ? theme.colors.blue[colorMode === "light" ? 600 : 300]
    : colorMode === "light"
    ? theme.colors.green[600]
    : theme.colors.yellow[300];

  const ButtonCssStyle = {
    display: "block",
    fontSize:
      desktop && compact
        ? "2.5vw"
        : `max(1rem, min(calc(12vw / ${children.toString().length}), 3.5vw))`,
    lineHeight: desktop ? "4vw" : "max(3vw, 1rem)",
    fontWeight: 800,
    width: "100%",
    height: !editable && desktop ? "100%" : undefined,
    margin: "auto",
    textAlign: "center",
    backgroundColor: filled ? variantColor : "transparent",
    color: filled ? defaultColor : variantColor,
    whiteSpace: "nowrap",
    overflow: "hidden",
    cursor: disabled || color === "green" || editable ? "default" : "pointer",
  };

  const handleClick = async () => {
    if (color !== "green" && !disabled) {
      try {
        await db.logs.put({
          id: nanoid(),
          game_id,
          player_id,
          variant: color === "red" ? "correct" : "wrong",
          system: true,
          timestamp: cdate().text(),
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {editable ? (
        <Editable defaultValue={children?.toString()} sx={ButtonCssStyle}>
          <EditablePreview sx={{ p: 0 }} />
          <EditableInput
            sx={{
              p: 0,
            }}
          />
        </Editable>
      ) : (
        <Button
          variant="unstyled"
          sx={ButtonCssStyle}
          _hover={{ opacity: disabled ? 1 : 0.5 }}
          onClick={handleClick}
        >
          {children}
        </Button>
      )}
    </>
  );
};

export default PlayerScoreButton;
