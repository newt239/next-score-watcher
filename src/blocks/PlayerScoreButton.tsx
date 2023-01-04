import { Box, Button } from "@chakra-ui/react";

import db from "#/utils/db";

type PlayerScoreButtonProps = {
  color: "red" | "blue" | "green" | "white";
  children: JSX.Element | JSX.Element[] | string | number;
  text?: boolean;
  game_id: number;
  player_id: number;
};

const PlayerScoreButton: React.FC<PlayerScoreButtonProps> = ({
  color,
  children,
  text = false,
  game_id,
  player_id,
}) => {
  const handleClick = async () => {
    if (color !== "green") {
      try {
        await db.logs.put({
          game_id,
          player_id,
          variant: "correct",
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Button
      variant="unstyled"
      color={color}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "clamp(5vh, 2rem, 5vw)",
        width: "100%",
        minWidth: 100,
        aspectRatio: "1 / 1",
        margin: "auto",
        cursor: "pointer",
        backgroundColor: "white",
        borderRadius: 0,
      }}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default PlayerScoreButton;
