import db, { ComputedScoreDBProps, GameDBProps } from "../db";

import attacksurvival from "./attacksurvival";
import freezex from "./freezex";
import nbyn from "./nbyn";
import nomx from "./nomx";
import nomxAd from "./nomx-ad";
import normal from "./normal";
import nupdown from "./nupdown";
import ny from "./ny";
import squarex from "./squarex";
import swedish10 from "./swedish10";
import variousFluctuations from "./various-fluctiations";
import z from "./z";

export type winThroughPlayerProps = { player_id: string; text: string } | null;

const computeScore = async (game_id: string) => {
  const game = await db.games.get(game_id);
  if (!game)
    return { scoreList: [], winThroughPlayer: { player_id: "", text: "" } };
  const gameLogList = await db.logs
    .where({ game_id: game_id })
    .sortBy("timestamp");

  let result: {
    scoreList: ComputedScoreDBProps[];
    winThroughPlayer: { player_id: string; text: string };
  };
  switch (game.rule) {
    case "normal":
      result = await normal(game, gameLogList);
    case "nomx":
      result = await nomx(game, gameLogList);
    case "nomx-ad":
      result = await nomxAd(game, gameLogList);
    case "ny":
      result = await ny(game, gameLogList);
    case "nbyn":
      result = await nbyn(game, gameLogList);
    case "nupdown":
      result = await nupdown(game, gameLogList);
    case "swedish10":
      result = await swedish10(game, gameLogList);
    case "attacksurvival":
      result = await attacksurvival(game, gameLogList);
    case "squarex":
      result = await squarex(game, gameLogList);
    case "z":
      result = await z(game, gameLogList);
    case "freezex":
      result = await freezex(game, gameLogList);
    case "various-fluctuations":
      result = await variousFluctuations(game, gameLogList);
  }
  const webhookUrl = localStorage.getItem("scorew-webhook-url");

  if (webhookUrl && webhookUrl.includes("http")) {
    const postData = { ...result, game, gameLogList };
    console.log(postData);
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
  }
  return result;
};

export const getInitialPlayersState = (game: GameDBProps) => {
  const initialPlayersState = game.players.map(
    (gamePlayer): ComputedScoreDBProps => {
      return {
        game_id: game.id,
        player_id: gamePlayer.id,
        state: "playing",
        reachState: "playing",
        score:
          game.rule === "attacksurvival"
            ? game.win_point!
            : ["nomx-ad", "various-fluctuations"].includes(game.rule)
            ? gamePlayer.initial_correct
            : 0,
        correct: ["nomx-ad", "various-fluctuations"].includes(game.rule)
          ? 0
          : gamePlayer.initial_correct,
        wrong: gamePlayer.initial_wrong,
        last_correct: -10000,
        last_wrong: -10000,
        odd_score: 0,
        even_score: 0,
        stage: 1,
        isIncapacity: false,
        order: 0,
        text: "",
      };
    }
  );
  return initialPlayersState;
};

export const getSortedPlayerOrderList = (
  playersState: ComputedScoreDBProps[]
) =>
  playersState
    .sort((pre, cur) => {
      // 勝ち抜けているかどうか
      if (pre.state === "win" && cur.state !== "win") return -1;
      else if (pre.state !== "win" && cur.state === "win") return 1;
      // 最後に正解した問題番号の若さを比較
      else if (pre.state === "win" && cur.state === "win") {
        if (pre.last_correct < cur.last_correct) return -1;
        else if (cur.last_correct < pre.last_correct) return 1;
      }
      // ステージを比較
      if (pre.stage > cur.stage) return -1;
      else if (cur.stage > pre.stage) return 1;
      // スコアを比較
      if (pre.score > cur.score) return -1;
      else if (cur.score > pre.score) return 1;
      // 正答数を比較
      if (pre.correct > cur.correct) return -1;
      else if (cur.correct > pre.correct) return 1;
      // 誤答数を比較
      if (pre.wrong > cur.wrong) return -1;
      else if (cur.wrong > pre.wrong) return 1;
      // 必要に応じて評価基準を追加
      else return 0;
    })
    .map((score) => score.player_id);

export const indicator = (i: number) => {
  i = Math.abs(i) + 1;
  var cent = i % 100;
  if (cent >= 10 && cent <= 20) return `${i}st`;
  var dec = i % 10;
  if (dec === 1) return `${i}st`;
  if (dec === 2) return `${i}nd`;
  if (dec === 3) return `${i}rd`;
  return `${i}th`;
};

export default computeScore;
