import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from "nanoid";

import { Database } from "./schema";

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
  const supabase = createClientComponentClient<Database>();
  const game_id = nanoid(9);

  if (typeof param !== "string") {
    const game_id = await db.games.put({
      ...param.game,
      id: nanoid(),
      name: `${param.game.name}のコピー`,
      // players: param.action_type === "copy-rule" ? [] : param.game.players,
    });
    return game_id;
  } else {
    try {
      const commonGameProps = {
        id: game_id,
        correct_me: 1,
        wrong_me: -1,
        discord_webhook_url: "",
        editable: false,
      };
      const { description, rows, ...params } = rules[param];
      await supabase.from("games").insert({
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
          } else if (0 < score && score < 5) {
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
      } else if (0 < score && score < 5) {
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

export const zenkaku2Hankaku = (str: string) => {
  return str.replace(/[A-Za-z0-9]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
  });
};

export const detectPlayerState = (
  game: GamePropsUnion,
  state: States,
  order: number,
  qn: number
): States => {
  if (state === "win") return "win";
  if (game.limit && game.win_through) {
    if (game.limit <= qn) {
      if (order < game.win_through) {
        return "win";
      } else {
        return "lose";
      }
    }
  }
  return state;
};
