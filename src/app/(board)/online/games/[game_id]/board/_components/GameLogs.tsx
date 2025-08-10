"use client";

import { useEffect, useMemo, useState } from "react";

import { Box, Button, Group, Table, Text } from "@mantine/core";
import {
  IconCheck,
  IconCopy,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { cdate } from "cdate";

import classes from "./GameLogs.module.css";

import type { GameDBPlayerProps, LogDBProps } from "@/utils/types";

type Props = {
  logs: LogDBProps[];
  players: GameDBPlayerProps[];
  order: "asc" | "desc";
  onToggleOrder: () => void;
};

const GameLogs: React.FC<Props> = ({ logs, players, order, onToggleOrder }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const _playerNameById = useMemo(() => {
    const map = new Map<string, string>();
    players.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [players]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => log.variant !== "multiple_wrong");
  }, [logs]);

  const shownLogs = useMemo(() => {
    return order === "asc" ? filteredLogs : [...filteredLogs].reverse();
  }, [filteredLogs, order]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyAsHTML = async () => {
    const logsWithTableFormat = `<table><tbody>${shownLogs
      .map((log, qn) => {
        const player = players.find((p) => p.id === log.player_id);
        return `
        <tr>
          <td>${order === "desc" ? filteredLogs.length - qn : qn + 1}.</td>
          <td>${
            player ? player.name : log.variant === "through" ? "(スルー)" : "-"
          }</td>
          <td>${
            log.variant === "correct"
              ? "o"
              : log.variant === "wrong"
                ? "x"
                : "-"
          }</td>
          <td>${cdate(log.timestamp || new Date().toISOString()).format("YYYY/MM/DD HH:mm:ss")}</td>
        </tr>`;
      })
      .join("")}
    </tbody></table>`;

    try {
      const blob = new Blob([logsWithTableFormat], {
        type: "text/html",
      });
      await window.navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
    } catch (e) {
      console.error("Failed to copy logs html:", e);
    }
  };

  return (
    <Box className={classes.game_logs}>
      <Group justify="space-between" mb="1rem">
        <Text fw={700}>Game Logs</Text>
        <Group>
          <Button
            size="xs"
            onClick={copyAsHTML}
            leftSection={
              copied ? <IconCheck size={20} /> : <IconCopy size={20} />
            }
          >
            コピーする
          </Button>
          <Button
            leftSection={
              order === "desc" ? (
                <IconSortAscending size={20} />
              ) : (
                <IconSortDescending size={20} />
              )
            }
            onClick={onToggleOrder}
            size="xs"
          >
            {order === "desc" ? "降順" : "昇順"}
          </Button>
        </Group>
      </Group>
      {filteredLogs.length !== 0 ? (
        <Table.ScrollContainer minWidth={1000}>
          <Table highlightOnHover>
            <Table.Tbody>
              {shownLogs.map((log, qn) => {
                const player = players.find((p) => p.id === log.player_id);
                return (
                  <Table.Tr key={log.id}>
                    <Table.Td>
                      {order === "desc" ? filteredLogs.length - qn : qn + 1}.
                    </Table.Td>
                    <Table.Td>
                      {player
                        ? player.name
                        : log.variant === "through"
                          ? "(スルー)"
                          : "-"}
                    </Table.Td>
                    <Table.Td>
                      {log.variant === "correct"
                        ? "o"
                        : log.variant === "wrong"
                          ? "x"
                          : "-"}
                    </Table.Td>
                    <Table.Td
                      title={cdate(
                        log.timestamp || new Date().toISOString()
                      ).format("YYYY年MM月DD日 HH時mm分ss秒")}
                    >
                      {cdate(log.timestamp || new Date().toISOString()).format(
                        "HH:mm:ss"
                      )}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      ) : (
        <p>ここに解答者の一覧が表示されます。</p>
      )}
    </Box>
  );
};

export default GameLogs;
