import { ReactNode } from "react";

import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  SystemStyleObject,
  theme,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import db from "#/utils/db";

type PlayerScoreButtonProps = {
  color: "red" | "blue" | "green" | "win" | "lose" | "playing";
  children: ReactNode;
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
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  const defaultColor = colorMode === "light" ? "white" : theme.colors.gray[800];
  const variantColor = ["red", "win"].includes(color)
    ? theme.colors.red[500]
    : ["blue", "lose"].includes(color)
    ? theme.colors.blue[500]
    : theme.colors.green[500];
  const ButtonCssStyle: SystemStyleObject = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: isLargerThan700 ? "clamp(4vh, 2rem, 4vw)" : "max(3vw, 1rem)",
    fontWeight: 800,
    width: "100%",
    minWidth: isLargerThan700 ? (compact ? 70 : 100) : compact ? 35 : 50,
    margin: "auto",
    backgroundColor: filled ? variantColor : "transparent",
    color: filled ? defaultColor : variantColor,
    whiteSpace: "nowrap",
    cursor: disabled || color === "green" ? "default" : "pointer",
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
    <div>
      {editable ? (
        <Editable defaultValue={children?.toString()} sx={ButtonCssStyle}>
          <EditablePreview sx={{ p: 0 }} />
          <EditableInput
            sx={{
              p: 0,
              width: 100,
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
    </div>
  );
};

export default PlayerScoreButton;
