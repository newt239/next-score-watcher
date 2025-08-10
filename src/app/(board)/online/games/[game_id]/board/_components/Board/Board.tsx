"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useEffect } from "react";

import { Box, Button, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import OnlineAQL from "../OnlineAQL/OnlineAQL";
import OnlineBoardHeader from "../OnlineBoardHeader";
import OnlineGameLogs from "../OnlineGameLogs";
import OnlinePlayers from "../OnlinePlayers/OnlinePlayers";

import classes from "./Board.module.css";

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

  // 勝ち抜けモーダル制御
  const [winTroughPlayer, setWinTroughPlayer] = useState<{
    name: string;
    text: string;
  }>({
    name: "",
    text: "",
  });

  const api = useMemo(() => createApiClient(), []);

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

  // useEffectを先に定義
  useEffect(() => {
    if (!game || !players.length) return;

    const isSettings = (v: unknown): v is Record<string, unknown> =>
      !!v && typeof v === "object";

    const settings = isSettings(initialSettings) ? initialSettings : {};

    const { winPlayers } = computeOnlineScore(
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

    if (winPlayers && winPlayers.length > 0) {
      const first = winPlayers[0];
      const player = players.find((p) => p.id === first.player_id);
      if (player?.name) {
        setWinTroughPlayer({ name: player.name, text: first.text });
      }
    }
  }, [logs, game, players, initialSettings]);

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

  const isSettings = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === "object";

  const settings = isSettings(initialSettings) ? initialSettings : {};

  const { scores } = computeOnlineScore(
    { id: game.id, name: game.name, ruleType: game.ruleType },
    players,
    logs,
    {
      winPoint:
        typeof settings.winPoint === "number" ? settings.winPoint : undefined,
      losePoint:
        typeof settings.losePoint === "number" ? settings.losePoint : undefined,
      targetPoint:
        typeof settings.targetPoint === "number"
          ? settings.targetPoint
          : undefined,
      restCount:
        typeof settings.restCount === "number" ? settings.restCount : undefined,
    }
  );
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

  return (
    <Box className={classes.board}>
      <OnlineBoardHeader
        game={{ id: game.id, name: game.name, ruleType: game.ruleType }}
        logsLength={logs.length}
        onUndo={undo}
      />

      {game.ruleType === "aql" ? (
        <OnlineAQL
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
          show_header={true}
        />
      ) : (
        <OnlinePlayers
          game={game}
          scores={scores}
          players={players}
          isPending={isPending}
          onAddLog={addLog}
        />
      )}

      <Group mt="lg" gap="xs">
        <Button size="xs" variant="default" disabled={isPending} onClick={undo}>
          一つ戻す
        </Button>
        <Button
          size="xs"
          variant="default"
          disabled={isPending}
          onClick={() => addLog("-", "through")}
        >
          スルー
        </Button>
      </Group>

      <OnlineGameLogs
        logs={logs}
        players={players}
        order={order}
        onToggleOrder={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
      />

      {(allWrong || allRest) && (
        <Box
          mt="md"
          p="sm"
          style={{
            border: "1px solid var(--mantine-color-gray-4)",
            borderRadius: 8,
          }}
        >
          <Text mb="xs">
            すべてのプレイヤーが休み、または全員が誤答しました。1問スルーしますか？
          </Text>
          <Group gap="xs">
            <Button
              size="xs"
              color="blue"
              onClick={() => addLog("-", "through")}
            >
              スルー
            </Button>
            <Button
              size="xs"
              variant="default"
              onClick={() => addLog("-", "skip")}
            >
              スキップ
            </Button>
          </Group>
        </Box>
      )}

      <WinModal
        onClose={() => setWinTroughPlayer({ name: "", text: "" })}
        winTroughPlayer={winTroughPlayer}
        roundName=""
      />
    </Box>
  );
};

export default Board;
