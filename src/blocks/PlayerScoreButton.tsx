import { Button } from "semantic-ui-react";

import db from "#/utils/db";

type PlayerScoreButtonProps = {
  variant: "correct" | "wrong" | "green";
  children: JSX.Element | JSX.Element[] | string | number;
  text?: boolean;
  game_id: number;
  player_id: number;
};

const PlayerScoreButton: React.FC<PlayerScoreButtonProps> = ({
  variant,
  children,
  text = false,
  game_id,
  player_id,
}) => {
  const color =
    variant === "correct" ? "red" : variant === "wrong" ? "blue" : variant;

  const handleClick = async () => {
    if (variant !== "green") {
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
      circular
      basic={text}
      color={color}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "clamp(5vh, 2rem, 5vw)",
        width: "100%",
        minWidth: 50,
        aspectRatio: "1 / 1",
        padding: 0,
        margin: "auto",
      }}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default PlayerScoreButton;
