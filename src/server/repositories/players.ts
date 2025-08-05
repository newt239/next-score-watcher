import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

import type { CreatePlayerData } from "@/models/players";

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
 * プレイヤー作成
 */
export const createPlayer = async (
  playerData: CreatePlayerData,
  userId: string
) => {
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
