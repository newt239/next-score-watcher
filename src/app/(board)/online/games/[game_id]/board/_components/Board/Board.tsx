"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { Box, Button, Flex, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

import AQL from "../AQL/AQL";
import ActionButtons from "../ActionButtons/ActionButtons";
import BoardHeader from "../BoardHeader/BoardHeader";
import GameLogs from "../GameLogs/GameLogs";
import Players from "../Players/Players";

import classes from "./Board.module.css";

import type {
  OnlineGameType,
  OnlineUserType,
  OnlineGameDBPlayerProps,
  LogDBProps,
} from "@/models/games";
import type { UserPreferencesType } from "@/models/user-preferences";

import WinModal from "@/app/(board)/games/[game_id]/board/_components/WinModal/WinModal";
import createApiClient from "@/utils/hono/client";
import { computeOnlineScore } from "@/utils/online/computeScore";

type BoardProps = {
  gameId: string;
  user: OnlineUserType | null;
  initialGame: OnlineGameType;
  initialPlayers: unknown[];
  initialLogs: unknown[];
  initialSettings: Record<string, unknown>;
};

const Board: React.FC<BoardProps> = ({
  gameId,
  user,
  initialGame,
  initialPlayers,
  initialLogs,
  initialSettings,
}) => {
  // プレイヤーデータの変換
  const convertedPlayers = (initialPlayers as unknown[]).map((p) => {
    const player = p as {
      id: string;
      name: string;
      initial_correct?: number;
      initial_wrong?: number;
    };
    return {
      id: player.id,
      name: player.name,
      initial_correct: player.initial_correct || 0,
      initial_wrong: player.initial_wrong || 0,
      base_correct_point: 1,
      base_wrong_point: 1,
    };
  });

  // ログデータの変換
  const convertedLogs = (initialLogs as unknown[]).map((l) => {
    const log = l as LogDBProps;
    return log;
  });

  const [players] = useState<OnlineGameDBPlayerProps[]>(convertedPlayers);
  const [logs, setLogs] = useState<LogDBProps[]>(convertedLogs);
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [skipSuggest, setSkipSuggest] = useState(false);

  // API経由でユーザー設定を管理
  const [preferences, setPreferences] = useState<UserPreferencesType | null>(
    null
  );

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
        if (data && "preferences" in data) {
          setPreferences(data.preferences);
        }
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
    }
  }, [api, user?.id]);

  const refreshLogs = useCallback(async () => {
    try {
      const res = await api["games"][":gameId"]["logs"].$get({
        param: { gameId },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && "logs" in json && Array.isArray(json.logs)) {
          const validLogs = json.logs
            .filter(
              (log: unknown) =>
                log &&
                typeof log === "object" &&
                "id" in log &&
                "player_id" in log &&
                "variant" in log &&
                "system" in log &&
                "available" in log &&
                (log.system === 0 || log.system === 1) &&
                (log.available === 0 || log.available === 1)
            )
            .map((log: unknown) => {
              const typedLog = log as LogDBProps;
              return {
                ...typedLog,
                system: typedLog.system as 0 | 1,
                available: typedLog.available as 0 | 1,
              } as LogDBProps;
            });
          setLogs(validLogs);
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
  }, [api, gameId]);

  const addLog = useCallback(
    async (playerId: string, actionType: LogDBProps["variant"]) => {
      startTransition(async () => {
        try {
          await api["games"]["logs"].$post({
            json: {
              gameId,
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
    [api, gameId, refreshLogs]
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
      if (!initialGame) return;
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
  }, [players, addLog, undo, initialGame]);

  // useEffectを先に定義
  useEffect(() => {
    if (!initialGame || !players.length) return;

    const { winPlayers } = computeOnlineScore(
      {
        id: initialGame.id,
        name: initialGame.name,
        ruleType: initialGame.ruleType,
      },
      players,
      logs,
      {
        winPoint:
          typeof initialSettings.winPoint === "number"
            ? initialSettings.winPoint
            : undefined,
        losePoint:
          typeof initialSettings.losePoint === "number"
            ? initialSettings.losePoint
            : undefined,
        targetPoint:
          typeof initialSettings.targetPoint === "number"
            ? initialSettings.targetPoint
            : undefined,
        restCount:
          typeof initialSettings.restCount === "number"
            ? initialSettings.restCount
            : undefined,
      }
    );

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
  }, [logs, initialGame, players, initialSettings]);

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

  const { scores } = computeOnlineScore(
    {
      id: initialGame.id,
      name: initialGame.name,
      ruleType: initialGame.ruleType,
    },
    players,
    logs,
    {
      winPoint:
        typeof initialSettings.winPoint === "number"
          ? initialSettings.winPoint
          : undefined,
      losePoint:
        typeof initialSettings.losePoint === "number"
          ? initialSettings.losePoint
          : undefined,
      targetPoint:
        typeof initialSettings.targetPoint === "number"
          ? initialSettings.targetPoint
          : undefined,
      restCount:
        typeof initialSettings.restCount === "number"
          ? initialSettings.restCount
          : undefined,
    }
  );

  return (
    <>
      <BoardHeader
        game={{
          id: initialGame.id,
          name: initialGame.name,
          ruleType: initialGame.ruleType,
        }}
        logsLength={logs.length}
        onUndo={undo}
        onThrough={addThrough}
        preferences={preferences}
        userId={user.id}
      />
      {initialGame.ruleType === "squarex" && (
        <Box
          className={classes.squarex_bar}
          style={{
            left: logs.length % 2 === 0 ? 0 : undefined,
            right: logs.length % 2 === 1 ? 0 : undefined,
          }}
        />
      )}
      {initialGame.ruleType === "aql" ? (
        <AQL
          scores={scores}
          players={players}
          isPending={isPending}
          onAddLog={addLog}
          team_name={{
            left_team:
              typeof initialSettings.leftTeam === "string"
                ? initialSettings.leftTeam
                : "Left Team",
            right_team:
              typeof initialSettings.rightTeam === "string"
                ? initialSettings.rightTeam
                : "Right Team",
          }}
          show_header={preferences?.showBoardHeader ?? true}
        />
      ) : (
        <Players
          game={initialGame}
          scores={scores}
          players={players}
          isPending={isPending}
          onAddLog={addLog}
          preferences={preferences}
        />
      )}

      <ActionButtons
        game={initialGame}
        logsLength={logs.length}
        onUndo={undo}
        onThrough={addThrough}
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
