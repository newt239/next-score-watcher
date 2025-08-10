"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useEffect } from "react";

import { Box, Button, Flex, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

import AQL from "../AQL/AQL";
import ActionButtons from "../ActionButtons/ActionButtons";
import BoardHeader from "../BoardHeader/BoardHeader";
import GameLogs from "../GameLogs";
import Players from "../Players/Players";

import classes from "./Board.module.css";

import type { UserPreferencesType } from "@/models/user-preferences";
import type { GameDBPlayerProps, LogDBProps, RuleNames } from "@/utils/types";

import WinModal from "@/app/(board)/games/[game_id]/board/_components/WinModal/WinModal";
import createApiClient from "@/utils/hono/client";
import { computeOnlineScore } from "@/utils/online/computeScore";

type Props = {
  game_id: string;
  user: User | null;
  initialGame: unknown;
  initialPlayers: unknown[];
  initialLogs: unknown[];
  initialSettings: unknown;
};

type User = {
  id: string;
  name: string;
  email: string;
};

type OnlineGame = { id: string; name: string; ruleType: RuleNames };
const isGame = (v: unknown): v is OnlineGame => {
  if (!v || typeof v !== "object") return false;
  const obj = v as Record<string, unknown>;
  return (
    "id" in obj &&
    "name" in obj &&
    "ruleType" in obj &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.ruleType === "string"
  );
};

const isPlayers = (v: unknown): v is GameDBPlayerProps[] => {
  if (!Array.isArray(v)) return false;
  return v.every((p) => {
    if (!p || typeof p !== "object") return false;
    const obj = p as Record<string, unknown>;
    return (
      "id" in obj &&
      "name" in obj &&
      typeof obj.id === "string" &&
      typeof obj.name === "string"
    );
  });
};

const isLogs = (v: unknown): v is LogDBProps[] => {
  if (!Array.isArray(v)) return false;
  return v.every((l) => {
    if (!l || typeof l !== "object") return false;
    const obj = l as Record<string, unknown>;
    return (
      "id" in obj &&
      "player_id" in obj &&
      "variant" in obj &&
      (typeof obj.id === "string" || typeof obj.id === "number") &&
      typeof obj.player_id === "string" &&
      typeof obj.variant === "string"
    );
  });
};

const Board: React.FC<Props> = ({
  game_id,
  user,
  initialGame,
  initialPlayers,
  initialLogs,
  initialSettings,
}) => {
  const game: OnlineGame | null = isGame(initialGame) ? initialGame : null;
  const [players] = useState<GameDBPlayerProps[]>(() => {
    if (!isPlayers(initialPlayers)) return [];
    // 重複を除去（IDが同じプレイヤーを除去）
    return initialPlayers.filter(
      (player, index, self) =>
        index === self.findIndex((p) => p.id === player.id)
    );
  });
  const [logs, setLogs] = useState<LogDBProps[]>(
    isLogs(initialLogs) ? initialLogs : []
  );
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [skipSuggest, setSkipSuggest] = useState(false);

  // API経由でユーザー設定を管理
  const [preferences, setPreferences] = useState<UserPreferencesType | null>(
    null
  );
  const [_isPreferencesLoading, setIsPreferencesLoading] = useState(true);

  // 勝ち抜けモーダル制御
  const [winTroughPlayer, setWinTroughPlayer] = useState<{
    name: string;
    text: string;
  }>({
    name: "",
    text: "",
  });

  const api = useMemo(() => createApiClient(), []);

  // 設定を取得
  const fetchPreferences = useCallback(async () => {
    if (!user?.id) return;

    try {
      const res = await api["user"][":user_id"]["preferences"].$get({
        param: { user_id: user.id },
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
    } finally {
      setIsPreferencesLoading(false);
    }
  }, [api, user?.id]);

  const refreshLogs = useCallback(async () => {
    try {
      const res = await api["games"][":gameId"]["logs"].$get({
        param: { gameId: game_id },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && "logs" in json && Array.isArray(json.logs)) {
          setLogs(json.logs as LogDBProps[]);
        }
      }
    } catch (e) {
      console.error("Failed to refresh logs:", e);
      notifications.show({
        title: "エラー",
        message: "ログの取得に失敗しました",
        color: "red",
      });
    }
  }, [api, game_id]);

  const addLog = useCallback(
    async (playerId: string, actionType: LogDBProps["variant"]) => {
      startTransition(async () => {
        try {
          await api["games"]["logs"].$post({
            json: {
              gameId: game_id,
              playerId,
              actionType,
              isSystemAction: false,
            },
          });
          await refreshLogs();
        } catch (e) {
          console.error("Failed to add log:", e);
          notifications.show({
            title: "エラー",
            message: "操作の記録に失敗しました",
            color: "red",
          });
        }
      });
    },
    [api, game_id, refreshLogs]
  );

  const addThrough = useCallback(() => {
    addLog("-", "through");
  }, [addLog]);

  const undo = useCallback(async () => {
    const last = logs[logs.length - 1];
    if (!last) return;
    startTransition(async () => {
      try {
        await api["games"]["logs"][":logId"].$delete({
          param: { logId: String(last.id) },
        });
        await refreshLogs();
      } catch (e) {
        console.error("Failed to undo log:", e);
        notifications.show({
          title: "エラー",
          message: "操作の取り消しに失敗しました",
          color: "red",
        });
      }
    });
  }, [api, logs, refreshLogs]);

  // キーボードショートカット
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!game) return;
      if (event.code.startsWith("Digit") || event.code.startsWith("Numpad")) {
        const code = event.code.startsWith("Digit")
          ? event.code[5]
          : event.code[6];
        const idx = Number(code);
        if (!Number.isNaN(idx) && players.length > 0) {
          let player = players[idx - 1];
          if (idx === 0 && players.length >= 10) player = players[9];
          if (player) {
            addLog(player.id, event.shiftKey ? "wrong" : "correct");
          }
        }
      } else if (
        event.code === "Comma" ||
        (event.code === "KeyZ" && (event.ctrlKey || event.metaKey))
      ) {
        undo();
      } else if (event.code === "Period") {
        addLog("-", "through");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [players, addLog, undo, game]);

  // scores計算をuseMemoで先に実行
  const isSettings = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === "object";

  const settings = isSettings(initialSettings) ? initialSettings : {};

  const { scores, winPlayers } = useMemo(() => {
    if (!game || !players.length) {
      return { scores: [], winPlayers: [] };
    }

    return computeOnlineScore(
      { id: game.id, name: game.name, ruleType: game.ruleType },
      players,
      logs,
      {
        winPoint:
          typeof settings.winPoint === "number" ? settings.winPoint : undefined,
        losePoint:
          typeof settings.losePoint === "number"
            ? settings.losePoint
            : undefined,
        targetPoint:
          typeof settings.targetPoint === "number"
            ? settings.targetPoint
            : undefined,
        restCount:
          typeof settings.restCount === "number"
            ? settings.restCount
            : undefined,
      }
    );
  }, [game, players, logs, settings]);

  // 勝ち抜け判定とスキップサジェストの処理
  useEffect(() => {
    if (!game || !players.length) return;

    if (winPlayers && winPlayers.length > 0) {
      const first = winPlayers[0];
      const player = players.find((p) => p.id === first.player_id);
      if (player?.name) {
        setWinTroughPlayer({ name: player.name, text: first.text });
      }
    }

    // スキップサジェスト判定
    const playingPlayers = scores.filter((s) => s.state === "playing");
    const incapacityPlayers = scores.filter(
      (s) => s.state === "playing" && s.is_incapacity
    );
    const last = logs[logs.length - 1];
    const allWrong =
      last?.variant === "multiple_wrong" &&
      typeof last.player_id === "string" &&
      last.player_id.split(",").length === playingPlayers.length;
    const allRest =
      playingPlayers.length > 0 &&
      playingPlayers.length === incapacityPlayers.length;

    if (allWrong || allRest) {
      setSkipSuggest(true);
    } else {
      setSkipSuggest(false);
    }
  }, [logs, game, players, scores, winPlayers]);

  // 初期設定取得
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  if (!user) {
    return (
      <Box className={classes.error}>
        <Text>サインインが必要です</Text>
      </Box>
    );
  }

  if (!game) {
    return (
      <Box className={classes.error}>
        <Text>ゲームが見つかりません</Text>
      </Box>
    );
  }

  return (
    <>
      <BoardHeader
        game={{ id: game.id, name: game.name, ruleType: game.ruleType }}
        logsLength={logs.length}
        onUndo={undo}
        onThrough={addThrough}
        preferences={preferences}
        userId={user.id}
      />
      {game.ruleType === "squarex" && (
        <Box
          className={classes.squarex_bar}
          style={{
            left: logs.length % 2 === 0 ? 0 : undefined,
            right: logs.length % 2 === 1 ? 0 : undefined,
          }}
        />
      )}
      {game.ruleType === "aql" ? (
        <AQL
          game={game}
          scores={scores}
          players={players}
          isPending={isPending}
          onAddLog={addLog}
          team_name={{
            left_team:
              typeof settings.leftTeam === "string"
                ? settings.leftTeam
                : "Left Team",
            right_team:
              typeof settings.rightTeam === "string"
                ? settings.rightTeam
                : "Right Team",
          }}
          show_header={preferences?.showBoardHeader ?? true}
        />
      ) : (
        <Players
          game={game}
          scores={scores}
          players={players}
          isPending={isPending}
          onAddLog={addLog}
          preferences={preferences}
        />
      )}

      <ActionButtons
        game={game}
        logsLength={logs.length}
        onUndo={undo}
        onThrough={addThrough}
        _preferences={preferences}
        userId={user.id}
      />

      <GameLogs
        logs={logs}
        players={players}
        order={order}
        onToggleOrder={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
      />

      <WinModal
        onClose={() => setWinTroughPlayer({ name: "", text: "" })}
        winTroughPlayer={winTroughPlayer}
        roundName=""
      />

      {skipSuggest && (
        <Flex className={classes.skip_suggest}>
          <Box>すべてのプレイヤーが休みの状態です。1問スルーしますか？</Box>
          <Flex gap="sm">
            <Button
              color="blue"
              onClick={() => addLog("-", "through")}
              size="sm"
            >
              スルー
            </Button>
            <Box visibleFrom="md">
              <Tooltip label="問題番号が進みますが、問題は更新されません。">
                <Button onClick={() => addLog("-", "skip")} size="sm">
                  スキップ
                </Button>
              </Tooltip>
            </Box>
            <Button
              leftSection={<IconX />}
              onClick={() => setSkipSuggest(false)}
              size="sm"
              color="red"
            >
              閉じる
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Board;
