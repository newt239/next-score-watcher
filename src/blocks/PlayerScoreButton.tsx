import { useState } from "react";

import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
} from "@chakra-ui/react";

import db from "#/utils/db";

type PlayerScoreButtonProps = {
  color: "red" | "blue" | "green" | "white";
  children: string | number;
  filled?: boolean;
  game_id: number;
  player_id: number;
  editable: boolean;
};

const PlayerScoreButton: React.FC<PlayerScoreButtonProps> = ({
  color,
  children,
  filled = false,
  game_id,
  player_id,
  editable,
}) => {
  const handleClick = async () => {
    if (color !== "green") {
      try {
        await db.logs.put({
          game_id,
          player_id,
          variant: "correct",
          system: true,
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
            mb: 3,
            backgroundColor: filled ? color : "white",
            color: filled ? "white" : color,
            borderRadius: 0,
          }}
        >
          <EditablePreview />
          <EditableInput
            sx={{
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
            aspectRatio: "1 / 1",
            margin: "auto",
            mb: 3,
            cursor: "pointer",
            backgroundColor: filled ? color : "white",
            color: filled ? "white" : color,
            borderRadius: 0,
          }}
          onClick={handleClick}
        >
          {children}
        </Button>
      )}
    </>
  );
};

export default PlayerScoreButton;
