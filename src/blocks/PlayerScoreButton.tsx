import { ReactNode } from "react";

import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  theme,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import db from "#/utils/db";

type PlayerScoreButtonProps = {
  color: "red" | "blue" | "green";
  children: ReactNode;
  filled?: boolean;
  compact?: boolean;
  rounded?: boolean;
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
  rounded = false,
  game_id,
  player_id,
  editable,
  disabled,
}) => {
  const { colorMode } = useColorMode();
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  const defaultColor = colorMode === "light" ? "white" : theme.colors.gray[800];
  const variantColor =
    color === "red"
      ? theme.colors.red[500]
      : color === "blue"
      ? theme.colors.blue[500]
      : theme.colors.green[500];
  const handleClick = async () => {
    if (color !== "green") {
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
        <Editable
          defaultValue={String(children)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: isLargerThan700
              ? "clamp(5vh, 2rem, 5vw)"
              : "max(7vw, 1rem)",
            fontWeight: 800,
            width: "100%",
            minWidth: isLargerThan700
              ? compact
                ? 70
                : 100
              : compact
              ? 35
              : 50,
            margin: "auto",
            backgroundColor: filled ? variantColor : defaultColor,
            color: filled ? defaultColor : variantColor,
            borderRadius: 0,
          }}
        >
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
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: isLargerThan700
              ? "clamp(5vh, 2rem, 5vw)"
              : "max(7vw, 1rem)",
            width: "100%",
            minWidth: isLargerThan700
              ? compact
                ? 70
                : 100
              : compact
              ? 35
              : 50,
            margin: "auto",
            cursor: color === "green" ? "default" : "pointer",
            backgroundColor: filled ? variantColor : defaultColor,
            color: filled ? defaultColor : variantColor,
            borderRadius: rounded ? "calc(1rem - 1px)" : 0,
          }}
          onClick={handleClick}
          disabled={disabled}
        >
          {children}
        </Button>
      )}
    </div>
  );
};

export default PlayerScoreButton;
