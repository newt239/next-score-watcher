import router from "next/router";

import { cdate } from "cdate";
import { nanoid } from "nanoid";

import db, { RuleNames, GameDBProps } from "./db";
import { event } from "./gtag";
import { rules } from "./rules";

import { getConfig } from "#/hooks/useLocalStorage";

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
    router.push(`/${game_id}/config`);
    return;
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
      case "various-fluctuations":
        putData.win_point = rules[rule_name].win_point;
        break;
    }
    event({ action: rule_name, category: "create_game", label: game_id });
    router.push(`/${await db.games.put(putData)}/config`);
  } catch (err) {
    console.log(err);
  }
};

export const numberSign = (type: "correct" | "wrong" | "pt") => {
  if (getConfig("scorewatcher-show-sign-string")) {
    switch (type) {
      case "correct":
        return "○";
      case "wrong":
        return "✕";
      case "pt":
        return "pt";
    }
  } else {
    return "";
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
