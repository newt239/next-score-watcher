import { cdate } from "cdate";

import attacksurvival from "#/utils/computeScore/attacksurvival";
import backstream from "#/utils/computeScore/backstream";
import freezex from "#/utils/computeScore/freezex";
import nbyn from "#/utils/computeScore/nbyn";
import nomr from "#/utils/computeScore/nomr";
import nomx from "#/utils/computeScore/nomx";
import nomxAd from "#/utils/computeScore/nomx-ad";
import normal from "#/utils/computeScore/normal";
import nupdown from "#/utils/computeScore/nupdown";
import ny from "#/utils/computeScore/ny";
import squarex from "#/utils/computeScore/squarex";
import swedish10 from "#/utils/computeScore/swedish10";
import variables from "#/utils/computeScore/variables";
import z from "#/utils/computeScore/z";
import db from "#/utils/db";
import {
  ComputedScoreProps,
  GamePropsUnion,
  States,
  WinPlayerProps,
} from "#/utils/types";

const computeScore = async (game_id: string) => {
  const game = await db.games.get(game_id);
  if (!game) return { scores: [], win_players: [], incapacity_players: [] };
  const gameLogList = await db.logs
    .where({ game_id: game_id })
    .sortBy("timestamp");

  let result: {
    scores: ComputedScoreProps[];
    winPlayers: WinPlayerProps[];
  };
  switch (game.rule) {
    case "normal":
      result = await normal(game, gameLogList);
      break;
    case "nomx":
      result = await nomx(game, gameLogList);
      break;
    case "nomx-ad":
      result = await nomxAd(game, gameLogList);
      break;
    case "ny":
      result = await ny(game, gameLogList);
      break;
    case "nomr":
      result = await nomr(game, gameLogList);
      break;
    case "nbyn":
      result = await nbyn(game, gameLogList);
      break;
    case "nupdown":
      result = await nupdown(game, gameLogList);
      break;
    case "swedish10":
      result = await swedish10(game, gameLogList);
      break;
    case "backstream":
      result = await backstream(game, gameLogList);
      break;
    case "attacksurvival":
      result = await attacksurvival(game, gameLogList);
      break;
    case "squarex":
      result = await squarex(game, gameLogList);
      break;
    case "z":
      result = await z(game, gameLogList);
      break;
    case "freezex":
      result = await freezex(game, gameLogList);
      break;
    case "variables":
      result = await variables(game, gameLogList);
      break;
  }

  let incapacity_players: string[] = [];
  result.scores.map((score) => {
    if (
      score.state === "playing" &&
      (score.is_incapacity || score.text.endsWith("休"))
    ) {
      incapacity_players.push(score.player_id);
    }
  });
  const data = {
    scores: result.scores,
    win_players: result.winPlayers,
    incapacity_players: incapacity_players,
  };

  if (result.winPlayers.length !== 0) {
    const playerName = game.players?.find(
      (player) => player.id! === result.winPlayers[0].player_id
    )?.name;

    if (playerName) {
      result.winPlayers[0].name = playerName;

      if (
        game.discord_webhook_url?.startsWith(
          "https://discord.com/api/webhooks/"
        )
      ) {
        const description = `
          ${result.winPlayers[0].name}さんが勝ち抜けました:tada:
          `;
        await fetch(game.discord_webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "Score Watcher",
            avatar_url:
              "https://score-watcher.newt239.dev/icons/icon-512x512.png",
            embeds: [
              {
                title: game.name,
                description,
                timestamp: cdate().utc().format("YYYY-MM-DD HH:mm:ss"),
                color: 2664261,
                footer: {
                  text: "© 2023 newt",
                  icon_url:
                    "https://pbs.twimg.com/profile_images/1621275964436258816/k0bKlqzs_400x400.jpg",
                },
              },
            ],
          }),
        });
      }
    }
  }

  const webhookUrl = localStorage.getItem("scorew-webhook-url");
  if (webhookUrl && webhookUrl.includes("http")) {
    const url = webhookUrl.split('"')[1];
    const data = { info: game, logs: gameLogList, scores: result.scores };
    console.log(data);
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(data),
    });
  }

  return data;
};

export const getInitialPlayersState = (game: GamePropsUnion) => {
  const initialPlayersState = game.players.map(
    (gamePlayer): ComputedScoreProps => {
      const playerState = {
        game_id: game.id,
        player_id: gamePlayer.id,
        state: "playing" as States,
        reach_state: "playing" as States,
        score:
          game.rule === "attacksurvival"
            ? game.win_point! + gamePlayer.initial_correct
            : game.rule === "ny"
            ? gamePlayer.initial_correct - gamePlayer.initial_wrong
            : gamePlayer.initial_correct,
        correct: ["variables"].includes(game.rule)
          ? 0
          : gamePlayer.initial_correct,
        wrong: gamePlayer.initial_wrong,
        last_correct: -10,
        last_wrong: -10,
        odd_score: 0,
        even_score: 0,
        stage: 1,
        is_incapacity: false,
        order: 0,
        text: "",
      };
      return playerState;
    }
  );
  return initialPlayersState;
};

export const getSortedPlayerOrderList = (playersState: ComputedScoreProps[]) =>
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
      if (pre.wrong > cur.wrong) return 1;
      else if (cur.wrong > pre.wrong) return -1;
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
