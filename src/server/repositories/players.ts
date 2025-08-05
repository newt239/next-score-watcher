import { eq, asc, count, and } from "drizzle-orm";
import { nanoid } from "nanoid";

import type {
  CreatePlayerRequestType,
  UpdatePlayerRequestType,
  ApiPlayerDataType,
  GetPlayersListResponseType,
} from "@/models/players";

import { DBClient } from "@/utils/drizzle/client";
import { player } from "@/utils/drizzle/schema";

/**
 * プレイヤー一覧取得
 */
export const getPlayers = async (userId: string) => {
  const players = await DBClient.select()
    .from(player)
    .where(eq(player.userId, userId))
    .orderBy(asc(player.name));

  return players.map((p) => ({
    id: p.id,
    name: p.name,
    text: p.displayName,
    belong: p.affiliation || "",
    tags: [], // TODO: タグ機能実装時に修正
  }));
};

/**
 * プレイヤー一覧取得（ページネーション対応）
 */
export const getPlayersWithPagination = async (
  userId: string,
  limit = 50,
  offset = 0
): Promise<GetPlayersListResponseType> => {
  // プレイヤー一覧を取得
  const players = await DBClient.select()
    .from(player)
    .where(eq(player.userId, userId))
    .orderBy(asc(player.name))
    .limit(limit)
    .offset(offset);

  // 総数を取得
  const [totalResult] = await DBClient.select({ count: count() })
    .from(player)
    .where(eq(player.userId, userId));

  // レスポンス形式に変換
  const playersResponse: ApiPlayerDataType[] = players.map((p) => ({
    id: p.id,
    name: p.name,
    text: p.displayName,
    belong: p.affiliation || "",
    tags: [], // TODO: タグ機能実装時に修正
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return {
    players: playersResponse,
    total: totalResult.count,
  } as const;
};

/**
 * プレイヤー詳細取得
 */
export const getPlayerById = async (
  playerId: string,
  userId: string
): Promise<ApiPlayerDataType | null> => {
  const [playerResult] = await DBClient.select()
    .from(player)
    .where(and(eq(player.id, playerId), eq(player.userId, userId)));

  if (!playerResult) {
    return null;
  }

  return {
    id: playerResult.id,
    name: playerResult.name,
    text: playerResult.displayName,
    belong: playerResult.affiliation || "",
    tags: [], // TODO: タグ機能実装時に修正
    createdAt: playerResult.createdAt.toISOString(),
    updatedAt: playerResult.updatedAt.toISOString(),
  } as const;
};

/**
 * プレイヤー作成
 */
export const createPlayer = async (
  playerData: CreatePlayerRequestType,
  userId: string
): Promise<string> => {
  const playerId = nanoid();

  await DBClient.insert(player).values({
    id: playerId,
    name: playerData.name,
    displayName: playerData.displayName,
    affiliation: playerData.affiliation,
    description: playerData.description,
    userId,
  });

  return playerId;
};

/**
 * プレイヤー更新
 */
export const updatePlayer = async (
  playerId: string,
  playerData: UpdatePlayerRequestType,
  userId: string
): Promise<boolean> => {
  const result = await DBClient.update(player)
    .set({
      ...playerData,
      updatedAt: new Date(),
    })
    .where(and(eq(player.id, playerId), eq(player.userId, userId)));

  return result.rowsAffected > 0;
};

/**
 * プレイヤー削除
 */
export const deletePlayer = async (
  playerId: string,
  userId: string
): Promise<boolean> => {
  const result = await DBClient.update(player)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(player.id, playerId), eq(player.userId, userId)));

  return result.rowsAffected > 0;
};
