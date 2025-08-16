import { getBoardCacheKey } from "./cache-keys";
import { deleteFromKV, getFromKV, putToKV } from "./cloudflare-kv";

import type { GetViewerBoardDataResponseType } from "@/models/game";

/**
 * ボードデータをキャッシュに保存
 */
export const cacheBoardData = async (
  gameId: string,
  boardData: GetViewerBoardDataResponseType
): Promise<boolean> => {
  try {
    const cacheKey = getBoardCacheKey(gameId);
    const jsonData = JSON.stringify(boardData);

    return await putToKV(cacheKey, jsonData);
  } catch (error) {
    console.error(`Failed to cache board data for game ${gameId}:`, error);
    return false;
  }
};

/**
 * キャッシュからボードデータを取得
 */
export const getCachedBoardData = async (
  gameId: string
): Promise<GetViewerBoardDataResponseType | null> => {
  try {
    const cacheKey = getBoardCacheKey(gameId);
    const cachedData = await getFromKV(cacheKey);

    if (!cachedData) {
      return null;
    }

    return JSON.parse(cachedData) as GetViewerBoardDataResponseType;
  } catch (error) {
    console.error(`Failed to get cached board data for game ${gameId}:`, error);
    return null;
  }
};

/**
 * ボードデータのキャッシュを削除
 */
export const invalidateBoardCache = async (
  gameId: string
): Promise<boolean> => {
  try {
    const cacheKey = getBoardCacheKey(gameId);
    return await deleteFromKV(cacheKey);
  } catch (error) {
    console.error(
      `Failed to invalidate board cache for game ${gameId}:`,
      error
    );
    return false;
  }
};

/**
 * ゲームが公開かどうかをチェック
 */
export const isGamePublic = async (_gameId: string): Promise<boolean> => {
  // TODO: 実際の実装では、ゲームテーブルから is_public を確認する
  // 現在は仮の実装
  return false;
};
