import { sendGAEvent } from "@next/third-parties/google";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import db from "@/utils/db";
import { rules } from "@/utils/rules";

import type { GameDBPlayerProps, GamePropsUnion, RuleNames, States } from "@/utils/types";

export const createGame = async (
  param:
    | RuleNames
    | {
        game: GamePropsUnion;
        action_type: "copy-rule" | "copy-all";
      },
  currentProfile: string
) => {
  if (typeof param !== "string") {
    sendGAEvent({
      event: "create_game",
      value: param.game.rule,
    });
    const game_id = await db(currentProfile).games.put({
      ...param.game,
      id: nanoid(),
      name: `${param.game.name}のコピー`,
      players: param.action_type === "copy-rule" ? [] : param.game.players,
    });
    return game_id;
  } else {
    sendGAEvent({
      event: "create_game",
      value: param,
    });
    try {
      const game_id = nanoid(6);
      const commonGameProps: Omit<GamePropsUnion, "name" | "rule" | "options"> = {
        id: game_id,
        players: [],
        correct_me: 1,
        wrong_me: -1,
        discord_webhook_url: "",
        editable: false,
        last_open: cdate().text(),
      };
      const { description: _unused1, rows: _unused2, ...params } = rules[param];
      await db(currentProfile).games.put({
        ...commonGameProps,
        ...params,
      });
      return game_id;
    } catch (err) {
      console.log(err);
    }
  }
};

/** ゲームに設定できるプレイヤー人数の上限 */
export const MAX_PLAYER_COUNT = 14;

/**
 * 指定ゲームにデフォルト名（プレイヤーi）のプレイヤーを count 人作成して紐付ける。
 * @param game_id 対象のゲームID
 * @param count 作成する人数
 * @param currentProfile 現在のプロファイルID
 * @returns 作成したプレイヤー数
 */
export const createDefaultPlayers = async (
  game_id: string,
  count: number,
  currentProfile: string
) => {
  const gamePlayers: GameDBPlayerProps[] = [];
  for (let i = 1; i <= count; i++) {
    const name = `プレイヤー${i}`;
    const player_id = await db(currentProfile).players.put({
      id: nanoid(),
      name,
      text: "",
      belong: "",
      tags: [],
    });
    gamePlayers.push({
      id: player_id,
      name,
      initial_correct: 0,
      initial_wrong: 0,
      base_correct_point: 1,
      base_wrong_point: -1,
    });
  }
  await db(currentProfile).games.update(game_id, { players: gamePlayers });
  return count;
};

/** numberSign の表示設定。未指定時は localStorage から読み取る */
type NumberSignOptions = {
  /** スコアに「○」「✕」「pt」の文字列を付与するか */
  showSignString: boolean;
  /** 誤答数が4以下のとき✕の数で表示するか */
  wrongNumber: boolean;
};

/**
 * スコアの表示文字列を生成する。
 * options を渡すとその設定で計算し、省略時は localStorage から設定を読み取る（React 外のスコア計算用）。
 * @param type スコアの種別
 * @param score 表示する数値（未指定時は記号のみを返す）
 * @param options 表示設定（React コンポーネントからリアクティブな値を渡す）
 * @returns 表示用の文字列
 */
export const numberSign = (
  type: "correct" | "wrong" | "pt",
  score?: number,
  options?: NumberSignOptions
) => {
  const showSignString =
    options?.showSignString ?? localStorage.getItem("showSignString") !== "false";
  const wrongNumber = options?.wrongNumber ?? localStorage.getItem("wrongNumber") === "true";
  if (typeof score === "undefined") {
    switch (type) {
      case "correct":
        return "○";
      case "wrong":
        return "✕";
      case "pt":
        return "pt";
    }
  } else if (showSignString) {
    switch (type) {
      case "correct":
        return `${score}○`;
      case "wrong":
        if (wrongNumber) {
          if (score === 0) {
            return "・";
          } else if (0 < score && score < 5) {
            return "✕".repeat(score);
          } else {
            return `${score}✕`;
          }
        } else {
          return `${score}✕`;
        }
      case "pt":
        return `${score}pt`;
    }
  } else {
    if (type === "wrong" && wrongNumber) {
      if (score === 0) {
        return "・";
      } else if (0 < score && score < 5) {
        return "✕".repeat(score);
      } else {
        // 記号付与がオフのため誤答数5以上は数値のみで表示する
        return score.toString();
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

export const isDesktop = () => {
  return window.innerWidth > 1024;
};
