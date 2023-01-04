import { Button } from "@chakra-ui/react";

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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "clamp(5vh, 2rem, 5vw)",
        width: "100%",
        minWidth: 50,
        borderRadius: "50%",
        aspectRatio: "1 / 1",
        padding: 0,
        margin: "auto",
        color: "white",
        backgroundColor: color,
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default PlayerScoreButton;
