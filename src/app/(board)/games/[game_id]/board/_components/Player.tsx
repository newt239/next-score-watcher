"use client";

import { useEffect, useState } from "react";

import PlayerColorConfig from "./PlayerColorConfig";
import PlayerHeader from "./PlayerHeader";
import PlayerName from "./PlayerName";
import PlayerScore from "./PlayerScore";

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

  const getLightModeColor = (state: States) => {
    return state === "win"
      ? "red.600"
      : state == "lose"
        ? "blue.600"
        : undefined;
  };

  const getDarkModeColor = (state: States) => {
    return state === "win"
      ? "red.300"
      : state == "lose"
        ? "blue.300"
        : undefined;
  };

  if (!game.players) return null;

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        w: "100%",
        h: "10vh",
        backgroundColor: getLightModeColor(editedScore.state),
        color: getLightModeColor(editedScore.state) && "white",
        borderWidth: 3,
        borderStyle: "solid",
        borderColor:
          getLightModeColor(editedScore.state) ||
          getLightModeColor(editedScore.reach_state) ||
          "gray.100",
        borderRadius: "1rem",
        overflowX: "auto",
        overflowY: "hidden",
        transition: "all 0.2s ease",
        lg: {
          flexDirection: "column",
          w: `clamp(8vw, ${
            (98 - game.players.length || 0) / game.players.length
          }vw, 15vw)`,
          h: "inherit",
        },
        _dark: {
          backgroundColor: getDarkModeColor(editedScore.state),
          color: getDarkModeColor(editedScore.state) && "gray.800",
          borderColor:
            getDarkModeColor(editedScore.state) ||
            getDarkModeColor(editedScore.reach_state) ||
            "gray.700",
        },
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flexGrow: 1,
          w: "40vw",
          h: "100%",
          pl: "0.5rem",
          lg: {
            alignItems: "center",
            w: "100%",
            h: `calc(100% - ${rows * 2}vh)`,
            pl: "inherit",
          },
        })}
      >
        {game.editable ? (
          <PlayerColorConfig
            colorState={getLightModeColor(editedScore.state)}
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
