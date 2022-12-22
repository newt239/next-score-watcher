import { Button } from "semantic-ui-react";

import { States, Variants } from "#/utils/db";

type PlayerScoreButtonProps = {
  variant?: Variants;
  state: States;
  children: JSX.Element | JSX.Element[] | string | number;
  onClick?: () => void;
};

const PlayerScoreButton: React.FC<PlayerScoreButtonProps> = ({
  variant,
  state,
  children,
  onClick,
}) => {
  return (
    <Button
      circular
      color={
        variant === "correct" ? "red" : variant === "wrong" ? "blue" : "green"
      }
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
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default PlayerScoreButton;
