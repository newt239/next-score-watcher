import { cdate } from "cdate";

import { computeOnlineScore } from "./computeScore/computeOnlineScore";

import type {
  GetGameDetailResponseType,
  GamePlayerProps,
} from "@/models/games";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

// リポジトリからのゲームデータ型（非同期で取得される実際の型）
type GameWithRelations = NonNullable<
  Awaited<ReturnType<typeof import("@/server/repositories/game").getGameById>>
>;

/**
 * Discord Webhookによる勝ち抜け通知を送信する
 * @param gameData リポジトリから取得したゲームデータ
 */
export async function sendDiscordWinnerNotification(
  gameData: GameWithRelations
): Promise<void> {
  // Discord Webhook URLが設定されていない場合は何もしない
  if (
    !gameData.discordWebhookUrl?.startsWith("https://discord.com/api/webhooks/")
  ) {
    return;
  }

  try {
    // computeOnlineScore用にデータを変換
    const gameForCompute: GetGameDetailResponseType = {
      ...gameData,
      createdAt: gameData.createdAt?.toISOString() || "",
      updatedAt: gameData.updatedAt?.toISOString() || "",
      deletedAt: gameData.deletedAt?.toISOString() || null,
      players: gameData.players.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        affiliation: p.affiliation,
        displayOrder: p.displayOrder,
        initialScore: p.initialScore,
        initialCorrectCount: p.initialCorrectCount,
        initialWrongCount: p.initialWrongCount,
      })) as GamePlayerProps[],
      logs: gameData.logs.map((log) => ({
        ...log,
        timestamp: log.timestamp?.toISOString() || "",
        deletedAt: log.deletedAt?.toISOString() || null,
      })) as SeriarizedGameLog[],
    };

    // スコア計算を実行して勝者を判定
    const result = computeOnlineScore(
      gameForCompute,
      gameForCompute.players,
      gameForCompute.logs
    );

    // 勝ち抜けプレイヤーがいない場合は通知しない
    if (!result.winPlayers || result.winPlayers.length === 0) {
      return;
    }

    // 勝ち抜けプレイヤーの名前を取得
    const winnerPlayer = gameData.players.find(
      (player) => player.id === result.winPlayers[0].player_id
    );

    if (!winnerPlayer) {
      return;
    }

    // Discord通知メッセージを作成
    const description = `${winnerPlayer.name}さんが勝ち抜けました:tada:\nhttps://score-watcher.com/online/games/${gameData.id}/board`;

    // Discord Webhook APIにリクエストを送信
    await fetch(gameData.discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Score Watcher",
        avatar_url: "https://score-watcher.com/icons/icon-512x512.png",
        embeds: [
          {
            title: gameData.name,
            description,
            timestamp: cdate().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            color: 2664261, // Score Watcherのテーマカラー
            footer: {
              text: "© 2022-2024 newt",
              icon_url: "https://score-watcher.com/icons/icon-512x512.png",
            },
          },
        ],
      }),
    });
  } catch (error) {
    // Discord通知の失敗は非致命的エラーとして扱い、ログ出力のみ行う
    console.error("Discord webhook notification failed:", error);
  }
}

/**
 * Discord Webhookによるゲームリセット通知を送信する
 * @param gameData リポジトリから取得したゲームデータ
 */
export async function sendDiscordResetNotification(
  gameData: GameWithRelations
): Promise<void> {
  // Discord Webhook URLが設定されていない場合は何もしない
  if (
    !gameData.discordWebhookUrl?.startsWith("https://discord.com/api/webhooks/")
  ) {
    return;
  }

  try {
    // Discord通知メッセージを作成
    const description = `ゲームがリセットされました\nhttps://score-watcher.com/online/games/${gameData.id}/board`;

    // Discord Webhook APIにリクエストを送信
    await fetch(gameData.discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Score Watcher",
        avatar_url: "https://score-watcher.com/icons/icon-512x512.png",
        embeds: [
          {
            title: gameData.name,
            description,
            timestamp: cdate().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            color: 16711680, // 赤色（リセット通知用）
            footer: {
              text: "© 2022-2024 newt",
              icon_url: "https://score-watcher.com/icons/icon-512x512.png",
            },
          },
        ],
      }),
    });
  } catch (error) {
    // Discord通知の失敗は非致命的エラーとして扱い、ログ出力のみ行う
    console.error("Discord webhook notification failed:", error);
  }
}
