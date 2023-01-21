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

import db from "#/utils/db";

type PlayerScoreButtonProps = {
  color: "red" | "blue" | "green";
  children: string | number;
  filled?: boolean;
  game_id: string;
  player_id: string;
  editable: boolean;
  disabled?: boolean;
};

const PlayerScoreButton: React.FC<PlayerScoreButtonProps> = ({
  color,
  children,
  filled = false,
  game_id,
  player_id,
  editable,
  disabled,
}) => {
  const { colorMode } = useColorMode();
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
    <>
      {editable ? (
        <Editable
          defaultValue={String(children)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "clamp(5vh, 2rem, 5vw)",
            fontWeight: 800,
            width: "100%",
            minWidth: 100,
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
            fontSize: "clamp(5vh, 2rem, 5vw)",
            width: "100%",
            minWidth: 100,
            margin: "auto",
            cursor: color === "green" ? "default" : "pointer",
            backgroundColor: filled ? variantColor : defaultColor,
            color: filled ? defaultColor : variantColor,
            borderRadius: 0,
          }}
          onClick={handleClick}
          disabled={disabled}
        >
          {children}
        </Button>
      )}
    </>
  );
};

export default PlayerScoreButton;
