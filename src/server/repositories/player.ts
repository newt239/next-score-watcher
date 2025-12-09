import { and, asc, count, eq, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";

import type {
  AddPlayerTagRequestType,
  ApiPlayerDataType,
  CreatePlayerRequestType,
  CreatePlayerType,
  DeletePlayerRequestType,
  GetPlayersListResponseType,
  RemovePlayerTagRequestType,
  UpdatePlayerRequestType,
  UpdatePlayerType,
} from "@/models/player";

import { DBClient } from "@/utils/drizzle/client";
import { player, playerPlayerTag, playerTag } from "@/utils/drizzle/schema";

/**
 * プレイヤーのタグ一覧を取得
 */
const getPlayerTags = async (playerId: string): Promise<string[]> => {
  const tags = await DBClient.select({ tagName: playerTag.tagName })
    .from(playerPlayerTag)
    .innerJoin(playerTag, eq(playerPlayerTag.playerTagId, playerTag.id))
    .where(
      and(
        eq(playerPlayerTag.playerId, playerId),
        isNull(playerTag.deletedAt),
        isNull(playerPlayerTag.deletedAt)
      )
    );

  return tags.map((tag) => tag.tagName);
};

/**
 * プレイヤー一覧取得
 */
export const getPlayers = async (userId: string) => {
  const players = await DBClient.query.player.findMany({
    where: and(eq(player.userId, userId), isNull(player.deletedAt)),
    orderBy: asc(player.name),
    with: {
      playerPlayerTag: {
        with: {
          playerTag: true,
        },
      },
    },
  });

  const mappedPlayers = players.map((player) => ({
    id: player.id,
    name: player.name,
    description: player.description || "",
    affiliation: player.affiliation || "",
    tags: player.playerPlayerTag
      .map((tag) => tag.playerTag?.tagName)
      .filter((tag) => tag !== undefined),
  }));

  return mappedPlayers;
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
    .where(and(eq(player.userId, userId), isNull(player.deletedAt)))
    .orderBy(asc(player.name))
    .limit(limit)
    .offset(offset);

  // 総数を取得
  const [totalResult] = await DBClient.select({ count: count() })
    .from(player)
    .where(and(eq(player.userId, userId), isNull(player.deletedAt)));

  // レスポンス形式に変換（タグ付き）
  const playersResponse: ApiPlayerDataType[] = await Promise.all(
    players.map(async (p) => ({
      id: p.id,
      name: p.name,
      text: p.displayName,
      belong: p.affiliation || "",
      tags: await getPlayerTags(p.id),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))
  );

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
    tags: await getPlayerTags(playerResult.id),
    createdAt: playerResult.createdAt.toISOString(),
    updatedAt: playerResult.updatedAt.toISOString(),
  } as const;
};

/**
 * 単一プレイヤー作成
 */
export const createSinglePlayer = async (
  playerData: CreatePlayerType,
  userId: string
): Promise<string> => {
  const playerId = nanoid();

  await DBClient.insert(player).values({
    id: playerId,
    name: playerData.name,
    displayName: playerData.name,
    affiliation: playerData.affiliation,
    description: playerData.description,
    userId,
  });

  return playerId;
};

/**
 * プレイヤー作成（複数対応）
 */
export const createPlayer = async (
  playersData: CreatePlayerRequestType,
  userId: string
): Promise<{ ids: string[]; createdCount: number }> => {
  const playersToInsert = playersData.map((data) => ({
    id: nanoid(),
    name: data.name,
    displayName: data.name,
    affiliation: data.affiliation,
    description: data.description,
    userId,
  }));

  await DBClient.insert(player).values(playersToInsert);
  return {
    ids: playersToInsert.map((p) => p.id),
    createdCount: playersToInsert.length,
  };
};

/**
 * 単一プレイヤー更新
 */
export const updateSinglePlayer = async (
  playerId: string,
  playerData: Omit<UpdatePlayerType, "id">,
  userId: string
): Promise<boolean> => {
  const updateData = {
    ...playerData,
    updatedAt: new Date(),
  };

  // displayNameが提供されていない場合はnameを使用
  if (playerData.name && !playerData.displayName) {
    updateData.displayName = playerData.name;
  }

  const result = await DBClient.update(player)
    .set(updateData)
    .where(and(eq(player.id, playerId), eq(player.userId, userId)));

  return result.rowsAffected > 0;
};

/**
 * プレイヤー更新（複数対応）
 */
export const updatePlayer = async (
  playersData: UpdatePlayerRequestType,
  userId: string
): Promise<{ updatedCount: number }> => {
  let updatedCount = 0;

  for (const playerData of playersData) {
    const { id, ...updateData } = playerData;
    const updated = await updateSinglePlayer(id, updateData, userId);
    if (updated) {
      updatedCount++;
    }
  }

  return { updatedCount };
};

/**
 * プレイヤー削除（複数対応）
 */
export const deletePlayer = async (playerIds: DeletePlayerRequestType, userId: string) => {
  const deletedPlayerIds: string[] = [];

  for (const playerId of playerIds) {
    const result = await DBClient.update(player)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(player.id, playerId), eq(player.userId, userId)));

    if (result.rowsAffected > 0) {
      deletedPlayerIds.push(playerId);
    }
  }

  return deletedPlayerIds;
};

/**
 * プレイヤーにタグを追加
 */
export const addPlayerTag = async (
  playerId: string,
  tagData: AddPlayerTagRequestType,
  userId: string
): Promise<boolean> => {
  // まず、同じタグ名のplayerTagが存在するかチェック
  const [existingTag] = await DBClient.select()
    .from(playerTag)
    .where(
      and(
        eq(playerTag.tagName, tagData.tagName),
        eq(playerTag.userId, userId),
        isNull(playerTag.deletedAt)
      )
    );

  let tagId: string;

  if (existingTag) {
    tagId = existingTag.id;
  } else {
    // 新しいタグを作成
    tagId = nanoid();
    await DBClient.insert(playerTag).values({
      id: tagId,
      tagName: tagData.tagName,
      userId,
    });
  }

  // プレイヤーとタグの関連付けが既に存在するかチェック
  const [existingRelation] = await DBClient.select()
    .from(playerPlayerTag)
    .where(
      and(
        eq(playerPlayerTag.playerId, playerId),
        eq(playerPlayerTag.playerTagId, tagId),
        isNull(playerPlayerTag.deletedAt)
      )
    );

  if (existingRelation) {
    return true; // 既に関連付けが存在する場合は成功として扱う
  }

  // プレイヤーとタグを関連付け
  await DBClient.insert(playerPlayerTag).values({
    id: nanoid(),
    playerId,
    playerTagId: tagId,
  });

  return true;
};

/**
 * プレイヤーからタグを削除
 */
export const removePlayerTag = async (
  playerId: string,
  tagData: RemovePlayerTagRequestType,
  userId: string
): Promise<boolean> => {
  // タグIDを取得
  const [tagResult] = await DBClient.select({ id: playerTag.id })
    .from(playerTag)
    .where(
      and(
        eq(playerTag.tagName, tagData.tagName),
        eq(playerTag.userId, userId),
        isNull(playerTag.deletedAt)
      )
    );

  if (!tagResult) {
    return false; // タグが存在しない
  }

  // プレイヤーとタグの関連付けをソフト削除
  const result = await DBClient.update(playerPlayerTag)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(playerPlayerTag.playerId, playerId),
        eq(playerPlayerTag.playerTagId, tagResult.id),
        isNull(playerPlayerTag.deletedAt)
      )
    );

  return result.rowsAffected > 0;
};
