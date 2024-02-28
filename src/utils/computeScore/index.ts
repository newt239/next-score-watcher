import { cdate } from "cdate";

import attacksurvival from "./attacksurvival";
import backstream from "./backstream";
import freezex from "./freezex";
import nbyn from "./nbyn";
import nomr from "./nomr";
import nomx from "./nomx";
import nomxAd from "./nomx-ad";
import normal from "./normal";
import nupdown from "./nupdown";
import ny from "./ny";
import squarex from "./squarex";
import swedish10 from "./swedish10";
import variables from "./variables";
import z from "./z";

import {
  ComputedScoreProps,
  GameDBProps,
  GameLogDBProps,
  GamePlayerDBProps,
  GamePlayerWithProfileProps,
  States,
  WinPlayerProps,
} from "#/utils/types";

const computeScore = async ({
  game,
  game_players,
  game_logs,
}: {
  game: GameDBProps;
  game_players: GamePlayerWithProfileProps[];
  game_logs: GameLogDBProps[];
}) => {
  let result: {
    scores: ComputedScoreProps[];
    winPlayers: WinPlayerProps[];
  };

  const omittedGamePlayers = game_players.map((game_player) => {
    const { players, ...rest } = game_player;
    return rest as GamePlayerDBProps;
  });

  switch (game.rule) {
    case "normal":
      result = await normal(game, omittedGamePlayers, game_logs);
      break;
    case "nomx":
      result = await nomx(game, omittedGamePlayers, game_logs);
      break;
    case "nomx-ad":
      result = await nomxAd(game, omittedGamePlayers, game_logs);
      break;
    case "ny":
      result = await ny(game, omittedGamePlayers, game_logs);
      break;
    case "nomr":
      result = await nomr(game, omittedGamePlayers, game_logs);
      break;
    case "nbyn":
      result = await nbyn(game, omittedGamePlayers, game_logs);
      break;
    case "nupdown":
      result = await nupdown(game, omittedGamePlayers, game_logs);
      break;
    case "swedish10":
      result = await swedish10(game, omittedGamePlayers, game_logs);
      break;
    case "backstream":
      result = await backstream(game, omittedGamePlayers, game_logs);
      break;
    case "attacksurvival":
      result = await attacksurvival(game, omittedGamePlayers, game_logs);
      break;
    case "squarex":
      result = await squarex(game, omittedGamePlayers, game_logs);
      break;
    case "z":
      result = await z(game, omittedGamePlayers, game_logs);
      break;
    case "freezex":
      result = await freezex(game, omittedGamePlayers, game_logs);
      break;
    case "variables":
      result = await variables(game, omittedGamePlayers, game_logs);
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
    incapacity_players: incapacity_players,
    scores: result.scores,
    win_players: result.winPlayers,
  };

  if (result.winPlayers.length !== 0) {
    const playerName = game_players?.find(
      (player) => player.player_id === result.winPlayers[0].player_id
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
          body: JSON.stringify({
            avatar_url:
              "https://score-watcher.newt239.dev/icons/icon-512x512.png",
            embeds: [
              {
                color: 2664261,
                description,
                footer: {
                  icon_url:
                    "https://pbs.twimg.com/profile_images/1621275964436258816/k0bKlqzs_400x400.jpg",
                  text: "© 2023 newt",
                },
                timestamp: cdate().utc().format("YYYY-MM-DD HH:mm:ss"),
                title: game.name,
              },
            ],
            username: "Score Watcher",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
      }
    }
  }

  const webhookUrl = "no"; // TODO: webhook urlをユーザー設定から追加できるようにする
  if (webhookUrl && webhookUrl.includes("http")) {
    const url = webhookUrl.split('"')[1];
    const data = { info: game, logs: game_logs, scores: result.scores };
    console.log(data);
    await fetch(url, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
  }

  return data;
};

const initialBackstreamWrong = (wrong_num: number) => {
  const minusCountArray = [0, 1, 3, 6, 10];
  return wrong_num < 5 ? minusCountArray[clipNumber(wrong_num, 0, 4)] : 10;
};

const getInitialScore = (game: GameDBProps, player: GamePlayerDBProps) => {
  switch (game.rule) {
    case "attacksurvival":
      return game.win_point! + player.initial_correct;
    case "ny":
      return player.initial_correct - player.initial_wrong;
    case "nomr":
      return player.initial_correct;
    case "backstream":
      return (
        player.initial_correct - initialBackstreamWrong(player.initial_wrong)
      );
    default:
      return player.initial_correct;
  }
};

export const getInitialPlayersState = (
  game: GameDBProps,
  game_players: GamePlayerDBProps[]
) => {
  const initialPlayersState = game_players.map(
    (gamePlayer): ComputedScoreProps => {
      const playerState = {
        correct: ["attacksurvival", "variables"].includes(game.rule)
          ? 0
          : gamePlayer.initial_correct,
        even_score: 0,
        game_id: game.id,
        is_incapacity: false,
        last_correct: -10,
        last_wrong: -10,
        odd_score: 0,
        order: 0,
        player_id: gamePlayer.id,
        reach_state: "playing" as States,
        score: getInitialScore(game, gamePlayer),
        stage: 1,
        state: "playing" as States,
        text: "",
        wrong:
          game.rule === "backstream"
            ? initialBackstreamWrong(gamePlayer.initial_wrong)
            : gamePlayer.initial_wrong,
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

// 数値を範囲内の数字に丸める
export const clipNumber = (n: number, min: number, max: number) => {
  if (isNaN(n)) return 0;
  return n < min ? min : n > max ? max : n;
};

export default computeScore;
