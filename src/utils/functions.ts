import { cdate } from "cdate";
import { nanoid } from "nanoid";
import ReactGA from "react-ga4";

import db from "#/utils/db";
import { rules } from "#/utils/rules";
import { GameDBProps, RuleNames, States } from "#/utils/types";

export const createGame = async (
  param:
    | RuleNames
    | {
        game: GameDBProps;
        action_type: "copy-rule" | "copy-all";
      }
) => {
  if (typeof param !== "string") {
    const game_id = await db.games.put({
      ...param.game,
      id: nanoid(),
      name: `${param.game.name}のコピー`,
      players: param.action_type === "copy-rule" ? [] : param.game.players,
    });
    return game_id;
  } else {
    try {
      const game_id = nanoid(6);
      const putData: GameDBProps = {
        id: game_id,
        name: rules[param].name,
        players: [],
        rule: param,
        correct_me: 1,
        wrong_me: -1,
        editable: false,
        last_open: cdate().text(),
        discord_webhook_url: "",
      };
      switch (param) {
        case "nomx":
          putData.win_point = rules[param].win_point;
          putData.lose_point = rules[param].lose_point;
          break;
        case "nomx-ad":
          putData.win_point = rules[param].win_point;
          putData.lose_point = rules[param].lose_point;
          break;
        case "ny":
          putData.win_point = rules[param].win_point;
          break;
        case "nomr":
          putData.win_point = rules[param].win_point;
          putData.lose_point = rules[param].lose_point;
          break;
        case "nbyn":
          putData.win_point = rules[param].win_point;
          putData.lose_point = rules[param].lose_point;
          break;
        case "nupdown":
          putData.win_point = rules[param].win_point;
          putData.lose_point = rules[param].lose_point;
          break;
        case "swedish10":
          putData.win_point = rules[param].win_point;
          putData.lose_point = rules[param].lose_point;
          break;
        case "backstream":
          putData.win_point = rules[param].win_point;
          putData.lose_point = rules[param].lose_point;
          break;
        case "attacksurvival":
          putData.win_point = rules[param].win_point;
          putData.win_through = rules[param].win_through;
          putData.correct_me = rules[param].correct_me;
          putData.wrong_me = rules[param].wrong_me;
          putData.correct_other = rules[param].correct_other;
          putData.wrong_other = rules[param].wrong_other;
          break;
        case "squarex":
          putData.win_point = rules[param].win_point;
          break;
        case "z":
          putData.win_point = 10;
          break;
        case "freezex":
          putData.win_point = rules[param].win_point;
          break;
        case "variables":
          putData.win_point = rules[param].win_point;
          break;
      }
      ReactGA.send({
        action: param,
        category: "create_game",
        label: game_id,
      });
      await db.games.put(putData);
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
  game: GameDBProps,
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
