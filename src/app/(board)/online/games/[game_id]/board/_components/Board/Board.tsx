"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { Box, Button, Flex, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { parseResponse } from "hono/client";

import AQL from "../AQL/AQL";
import ActionButtons from "../ActionButtons/ActionButtons";
import BoardHeader from "../BoardHeader/BoardHeader";
import GameLogs from "../GameLogs/GameLogs";
import Players from "../Players/Players";

import classes from "./Board.module.css";

import type {
  GamePlayerProps,
  GetGameDetailResponseType,
  LogDBProps,
  OnlineUserType,
} from "@/models/game";
import type { UserPreferencesType } from "@/models/user-preference";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

import WinModal from "@/app/(board)/games/[game_id]/board/_components/WinModal/WinModal";
import createApiClient from "@/utils/hono/browser";
import { computeOnlineScore } from "@/utils/online/computeScore/computeOnlineScore";

type BoardProps = {
  gameId: string;
  user: OnlineUserType | null;
  initialGame: GetGameDetailResponseType;
  initialPreferences: UserPreferencesType | null;
};

const Board: React.FC<BoardProps> = ({
  gameId,
  user,
  initialGame,
  initialPreferences,
}) => {
  const [players] = useState<GamePlayerProps[]>(initialGame.players);
  const [logs, setLogs] = useState<SeriarizedGameLog[]>(initialGame.logs);
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [skipSuggest, setSkipSuggest] = useState(false);

  // サーバーから取得した設定を使用
  const [preferences] = useState<UserPreferencesType | null>(
    initialPreferences
  );

  // 勝ち抜けモーダル制御
  const [winTroughPlayer, setWinTroughPlayer] = useState<{
    name: string;
    text: string;
  }>({
    name: "",
    text: "",
  });

  const apiClient = createApiClient();

  const refreshLogs = useCallback(async () => {
    const res = await parseResponse(
      apiClient.games[":gameId"].logs.$get({
        param: { gameId },
      })
    );
    if ("error" in res) {
      console.error("Failed to fetch logs:", res.error);
      return;
    }
    setLogs(res.logs);
  }, [gameId]);

  const addLog = useCallback(
    async (playerId: string, actionType: LogDBProps["variant"]) => {
      startTransition(async () => {
        await parseResponse(
          apiClient.games.logs.$post({
            json: {
              gameId,
              playerId,
              actionType,
              isSystemAction: false,
            },
          })
        );
        await refreshLogs();
      });
    },
    [gameId, refreshLogs]
  );

  const addThrough = useCallback(() => {
    addLog("-", "through");
  }, [addLog]);

  const undo = useCallback(async () => {
    const last = logs[logs.length - 1];
    if (!last) return;
    startTransition(async () => {
      try {
        await parseResponse(
          apiClient.games.logs[":logId"].$delete({
            param: { logId: String(last.id) },
          })
        );
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
  }, [logs, refreshLogs]);

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

    const { winPlayers } = computeOnlineScore(initialGame, players, logs);

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
    if (!last) return;

    const allWrong =
      last.actionType === "multiple_wrong" &&
      typeof last.playerId === "string" &&
      last.playerId.split(",").length === playingPlayers.length;
    const allRest =
      playingPlayers.length > 0 &&
      playingPlayers.length === incapacityPlayers.length;

    if (allWrong || allRest) {
      setSkipSuggest(true);
    } else {
      setSkipSuggest(false);
    }
  }, [logs, initialGame, players]);

  if (!user) {
    return (
      <Box className={classes.error}>
        <Text>サインインが必要です</Text>
      </Box>
    );
  }

  const { scores } = computeOnlineScore(initialGame, players, logs);

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
            left_team: initialGame.option.left_team ?? "",
            right_team: initialGame.option.right_team ?? "",
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
        preferences={preferences}
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
