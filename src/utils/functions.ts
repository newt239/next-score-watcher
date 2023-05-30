import { cdate } from "cdate";
import { nanoid } from "nanoid";
import ReactGA from "react-ga4";

import db from "#/utils/db";
import { rules } from "#/utils/rules";
import { GameDBProps, RuleNames, States } from "#/utils/types";

export const createGame = async (
  rule_name: RuleNames,
  game?: GameDBProps,
  name?: string,
  type?: "copy"
) => {
  if (type === "copy" && game) {
    const game_id = await db.games.put({
      ...game,
      id: nanoid(),
      name: name ? name : rules[game.rule].name,
    });
    return game_id;
  }
  try {
    const game_id = nanoid(6);
    const putData: GameDBProps = {
      id: game_id,
      name: name ? name : rules[rule_name].name,
      players: [],
      rule: rule_name,
      correct_me: 1,
      wrong_me: -1,
      editable: false,
      last_open: cdate().text(),
    };
    switch (rule_name) {
      case "nomx":
        putData.win_point = rules[rule_name].win_point;
        putData.lose_point = rules[rule_name].lose_point;
        break;
      case "nomx-ad":
        putData.win_point = rules[rule_name].win_point;
        putData.lose_point = rules[rule_name].lose_point;
        break;
      case "ny":
        putData.win_point = rules[rule_name].win_point;
        break;
      case "nomr":
        putData.win_point = rules[rule_name].win_point;
        break;
      case "nbyn":
        putData.win_point = rules[rule_name].win_point;
        putData.lose_point = rules[rule_name].lose_point;
        break;
      case "nupdown":
        putData.win_point = rules[rule_name].win_point;
        putData.lose_point = rules[rule_name].lose_point;
        break;
      case "swedish10":
        putData.win_point = rules[rule_name].win_point;
        putData.lose_point = rules[rule_name].lose_point;
        break;
      case "backstream":
        putData.win_point = rules[rule_name].win_point;
        putData.lose_point = rules[rule_name].lose_point;
        break;
      case "attacksurvival":
        putData.win_point = rules[rule_name].win_point;
        putData.win_through = rules[rule_name].win_through;
        putData.correct_me = rules[rule_name].correct_me;
        putData.wrong_me = rules[rule_name].wrong_me;
        putData.correct_other = rules[rule_name].correct_other;
        putData.wrong_other = rules[rule_name].wrong_other;
        break;
      case "squarex":
        putData.win_point = rules[rule_name].win_point;
        break;
      case "z":
        putData.win_point = 10;
        break;
      case "freezex":
        putData.win_point = rules[rule_name].win_point;
        break;
      case "variables":
        putData.win_point = rules[rule_name].win_point;
        break;
    }
    ReactGA.send({
      action: rule_name,
      category: "create_game",
      label: game_id,
    });
    await db.games.put(putData);
    return game_id;
  } catch (err) {
    console.log(err);
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
