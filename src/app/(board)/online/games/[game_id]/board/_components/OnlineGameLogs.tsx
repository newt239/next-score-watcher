"use client";

import { useMemo } from "react";

import { Button, Group, Table, Text } from "@mantine/core";

import type { GameDBPlayerProps, LogDBProps } from "@/utils/types";

type Props = {
  logs: LogDBProps[];
  players: GameDBPlayerProps[];
  order: "asc" | "desc";
  onToggleOrder: () => void;
};

const OnlineGameLogs: React.FC<Props> = ({
  logs,
  players,
  order,
  onToggleOrder,
}) => {
  const playerNameById = useMemo(() => {
    const map = new Map<string, string>();
    players.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [players]);

  const shownLogs = useMemo(() => {
    return order === "asc" ? logs : [...logs].reverse();
  }, [logs, order]);

  const copyAsHTML = async () => {
    const rows = shownLogs
      .map((l, i) => {
        const n = order === "asc" ? i + 1 : shownLogs.length - i;
        const name =
          l.player_id === "-" ? "-" : playerNameById.get(l.player_id) || "?";
        return `<tr><td>${n}</td><td>${name}</td><td>${l.variant}</td></tr>`;
      })
      .join("");
    const html = `<table><thead><tr><th>#</th><th>Player</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table>`;
    try {
      await navigator.clipboard.writeText(html);
    } catch (e) {
      console.error("Failed to copy logs html:", e);
    }
  };

  return (
    <>
      <Group justify="space-between" mt="lg" mb="xs">
        <Text fw={600}>ログ</Text>
        <Group gap="xs">
          <Button size="xs" variant="default" onClick={onToggleOrder}>
            {order === "asc" ? "降順にする" : "昇順にする"}
          </Button>
          <Button size="xs" variant="default" onClick={copyAsHTML}>
            HTMLをコピー
          </Button>
        </Group>
      </Group>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>プレイヤー</Table.Th>
            <Table.Th>操作</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {shownLogs.map((l, i) => {
            const n = order === "asc" ? i + 1 : shownLogs.length - i;
            const name =
              l.player_id === "-"
                ? "-"
                : playerNameById.get(l.player_id) || "?";
            return (
              <Table.Tr key={l.id}>
                <Table.Td>{n}</Table.Td>
                <Table.Td>{name}</Table.Td>
                <Table.Td>{l.variant}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default OnlineGameLogs;
