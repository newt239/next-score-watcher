"use client";

import { useEffect, useState } from "react";

import PlayerColorConfig from "./PlayerColorConfig";
import PlayerHeader from "./PlayerHeader";
import PlayerName from "./PlayerName";
import PlayerScore from "./PlayerScore";

import { getColor } from "#/utils/functions";
import { rules } from "#/utils/rules";
import {
  ComputedScoreProps,
  GameDBProps,
  GamePlayerWithProfileProps,
  RuleNames,
  States,
} from "#/utils/types";
import { css } from "@panda/css";

type PlayerProps = {
  game: GameDBProps;
  player: GamePlayerWithProfileProps;
  index: number;
  score: ComputedScoreProps | undefined;
};

const Player: React.FC<PlayerProps> = ({ game, player, index, score }) => {
  const [editableState, setEditableState] = useState<States>("playing");

  useEffect(() => {
    if (score) {
      setEditableState(score.state || "playing");
    }
  }, [score]);

  if (!score) return null;

  const rows = rules[game.rule as RuleNames].rows;

  const editedScore: ComputedScoreProps = {
    ...score,
    state: game.editable ? editableState : score.state,
  };

  if (!game.players) return null;

  return (
    <div
      className={css({
        _dark: {
          backgroundColor: getColor("dark", "bg", editedScore.state),
          borderColor:
            getColor("dark", "bg", editedScore.state) ||
            getColor("dark", "bg", editedScore.reach_state) ||
            "gray.700",
          color: getColor("dark", "text", editedScore.state) && "gray.800",
        },
        alignItems: "stretch",
        backgroundColor:
          getColor("light", "bg", editedScore.state) || "gray.100",
        borderColor:
          getColor("light", "bg", editedScore.state) ||
          getColor("light", "bg", editedScore.reach_state) ||
          "gray.100",
        borderRadius: "1rem",
        borderStyle: "solid",
        borderWidth: 3,
        color: getColor("light", "text", editedScore.state),
        display: "flex",
        flexDirection: "row",
        h: "10vh",
        justifyContent: "space-between",
        lg: {
          flexDirection: "column",
          h: "inherit",
          maxWidth: "15vw",
          w: `clamp(8vw, ${
            (98 - game.players.length || 0) / game.players.length
          }vw, 15vw)`,
        },
        overflowX: "auto",
        overflowY: "hidden",
        transition: "all 0.2s ease",
        w: "100%",
      })}
    >
      <div
        className={css({
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          h: "100%",
          lg: {
            alignItems: "center",
            h: `calc(100% - ${rows * 2}vh)`,
            pl: "inherit",
            w: "100%",
          },
          pl: "0.5rem",
          w: "40vw",
        })}
      >
        {game.editable ? (
          <PlayerColorConfig
            colorState={getColor("light", "bg", editedScore.state)}
            editableState={editableState}
            setEditableState={setEditableState}
          />
        ) : (
          <PlayerHeader
            belong={player.players.belong}
            index={index}
            text={player.players.order}
          />
        )}
        <PlayerName player_name={player.name} />
      </div>
      <PlayerScore game={game} player={editedScore} />
    </div>
  );
};

export default Player;
