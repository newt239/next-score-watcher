import { cdate } from "cdate";
import { nanoid } from "nanoid";
import ReactGA from "react-ga4";

import db from "#/utils/db";
import { rules } from "#/utils/rules";
import { GamePropsUnion, RuleNames, States } from "#/utils/types";

export const createGame = async (
  param:
    | RuleNames
    | {
        game: GamePropsUnion;
        action_type: "copy-rule" | "copy-all";
      }
) => {
  if (typeof param !== "string") {
    ReactGA.event({
      action: "create_game",
      category: "engagement",
      label: param.game.rule,
    });
    const game_id = await db.games.put({
      ...param.game,
      id: nanoid(),
      name: `${param.game.name}のコピー`,
      players: param.action_type === "copy-rule" ? [] : param.game.players,
    });
    return game_id;
  } else {
    ReactGA.event({
      action: "create_game",
      category: "engagement",
      label: param,
    });
    try {
      const game_id = nanoid(6);
      const commonGameProps: Omit<GamePropsUnion, "name" | "rule" | "options"> =
        {
          id: game_id,
          players: [],
          correct_me: 1,
          wrong_me: -1,
          discord_webhook_url: "",
          editable: false,
          last_open: cdate().text(),
        };
      const { description, rows, ...params } = rules[param];
      await db.games.put({
        ...commonGameProps,
        ...params,
      });
      return game_id;
    } catch (err) {
      console.log(err);
    }
  }
};

export const numberSign = (
  type: "correct" | "wrong" | "pt",
  score?: number
) => {
  const showSignString = localStorage.getItem("scorew-show-sign-string");
  const wrongNumber = localStorage.getItem("scorew-wrong-number");
  if (typeof score === "undefined") {
    switch (type) {
      case "correct":
        return "○";
      case "wrong":
        return "✕";
      case "pt":
        return "pt";
    }
  } else if (showSignString === "true" || showSignString === null) {
    switch (type) {
      case "correct":
        return `${score}○`;
      case "wrong":
        if (wrongNumber === "true") {
          if (score === 0) {
            return "・";
          } else if (score <= 4) {
            return "✕".repeat(score);
          } else {
            return `${score}○`;
          }
        } else {
          return `${score}✕`;
        }
      case "pt":
        return `${score}pt`;
    }
  } else {
    if (type === "wrong" && wrongNumber === "true") {
      if (score === 0) {
        return "・";
      } else if (score <= 4) {
        return "✕".repeat(score);
      } else {
        return `${score}○`;
      }
    } else {
      return score.toString();
    }
  }
};

export const str2num = (str: unknown): number => {
  if (typeof str === "number") {
    return str;
  }
  if (typeof str === "string") {
    const x = parseInt(str);
    return Number.isNaN(x) ? 0 : x;
  }
  return 0;
};

export const detectPlayerState = (
  game: GamePropsUnion,
  state: States,
  order: number,
  qn: number
): States => {
  if (state === "win") return "win";
  if (game.limit && game.win_through) {
    if (game.limit <= qn && order < game.win_through) {
      return "win";
    }
  }
  return state;
};
