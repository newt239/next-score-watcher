import { getRuleStringByType } from "@/utils/rules";

import type { GamePropsUnion, LogDBProps, ParsedGameListItem } from "@/utils/types";

/**
 * ゲームとログの配列を一覧表示用に整形する。
 * orderType に応じて最終閲覧順またはゲーム名順で並べ替え、各ゲームの進行状況を算出する。
 */
export const parseGameList = (
  games: GamePropsUnion[] | undefined,
  logs: LogDBProps[] | undefined,
  orderType: "last_open" | "name"
): ParsedGameListItem[] => {
  return [...(games ?? [])]
    .sort((prev, cur) => {
      if (orderType === "last_open") {
        if (prev.last_open > cur.last_open) return -1;
        if (prev.last_open < cur.last_open) return 1;
        return 0;
      } else {
        if (prev.name < cur.name) return -1;
        if (prev.name > cur.name) return 1;
        return 0;
      }
    })
    .map((game) => {
      const eachGameLogs = (logs ?? []).filter((log) => log.game_id === game.id);
      const gameState = eachGameLogs.length === 0 ? "設定中" : `${eachGameLogs.length}問目`;
      return {
        id: game.id,
        name: game.name,
        type: getRuleStringByType(game),
        player_count: game.players.length,
        state: gameState,
        last_open: game.last_open,
      };
    });
};
