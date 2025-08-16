"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

import { parseResponse } from "hono/client";

import type { GetGameDetailResponseType } from "@/models/game";

import createApiClient from "@/utils/hono/browser";

type GameStateContextType = {
  game: GetGameDetailResponseType | null;
  isLoading: boolean;
  error: string | null;
  updateGame: () => Promise<void>;
};

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
);

type GameStateProviderProps = {
  children: React.ReactNode;
  gameId: string;
  initialGame: GetGameDetailResponseType;
};

/**
 * ゲーム状態を管理するProvider
 * config内の各コンポーネントでゲーム状態を共有し、更新を同期する
 */
export const GameStateProvider = ({
  children,
  gameId,
  initialGame,
}: GameStateProviderProps) => {
  const [game, setGame] = useState<GetGameDetailResponseType | null>(
    initialGame
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * APIからゲーム情報を再取得して状態を更新
   */
  const updateGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiClient = createApiClient();
      const result = await parseResponse(
        apiClient.games[":gameId"].$get({
          param: { gameId },
        })
      );

      if ("error" in result) {
        setError("ゲーム情報の取得に失敗しました");
      } else {
        setGame(result.data);
      }
    } catch (err) {
      setError("ゲーム情報の取得中にエラーが発生しました");
      console.error("Failed to fetch game data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [gameId]);

  const value = {
    game,
    isLoading,
    error,
    updateGame,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

/**
 * ゲーム状態を使用するためのカスタムフック
 * config内のコンポーネントでゲーム情報の取得・更新を行う
 */
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
