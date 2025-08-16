/**
 * キャッシュキーの命名規則管理
 */

/**
 * ボードデータのキャッシュキーを生成
 */
export const getBoardCacheKey = (gameId: string): string => {
  return `board_cache:${gameId}`;
};

/**
 * ゲーム設定のキャッシュキーを生成
 */
export const getGameSettingsCacheKey = (gameId: string): string => {
  return `game_settings:${gameId}`;
};

/**
 * プレイヤー一覧のキャッシュキーを生成
 */
export const getPlayersCacheKey = (gameId: string): string => {
  return `players:${gameId}`;
};

/**
 * ログ一覧のキャッシュキーを生成
 */
export const getLogsCacheKey = (gameId: string): string => {
  return `logs:${gameId}`;
};

/**
 * 計算済みスコアのキャッシュキーを生成
 */
export const getComputedScoresCacheKey = (gameId: string): string => {
  return `computed_scores:${gameId}`;
};
