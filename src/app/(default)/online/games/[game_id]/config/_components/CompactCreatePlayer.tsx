"use client";

import { useRef, useState, useTransition } from "react";

import { Button, Flex, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus } from "@tabler/icons-react";
// import { nanoid } from "nanoid";

import type { GameDBPlayerProps } from "@/utils/types";

import createApiClient from "@/utils/hono/client";

type Props = {
  game_id: string;
  players: GameDBPlayerProps[];
};

/**
 * オンライン版コンパクトプレイヤー作成コンポーネント
 * プレイヤーを作成してゲームに追加
 */
const CompactCreatePlayer: React.FC<Props> = ({ game_id, players }) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [playerText, setPlayerText] = useState<string>("");
  const [playerBelong, setPlayerBelong] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;
    if (!playerName) return;
    addNewPlayer();
  };

  const addNewPlayer = async () => {
    if (isPending) return;

    startTransition(async () => {
      try {
        // プレイヤーを作成
        const apiClient = createApiClient();
        const createPlayerResponse = await apiClient.players.$post({
          json: [
            {
              name: playerName,
              description: playerText,
              affiliation: playerBelong,
            },
          ],
        });

        if (!createPlayerResponse.ok) {
          throw new Error("Failed to create player");
        }

        const newPlayer = await createPlayerResponse.json();

        // ゲームにプレイヤーを追加
        await apiClient.games[":gameId"].players.$post({
          param: { gameId: game_id },
          json: {
            playerId: newPlayer.data.ids[0],
            displayOrder: players.length,
            initialScore: 0,
            initialCorrectCount: 0,
            initialWrongCount: 0,
          },
        });

        notifications.show({
          title: "プレイヤーを作成しました",
          message: playerName,
          autoClose: 9000,
          withCloseButton: true,
        });

        setPlayerName("");
        setPlayerText("");
        setPlayerBelong("");
        nameInputRef.current?.focus();
      } catch (error) {
        console.error("Failed to add new player:", error);
        notifications.show({
          title: "エラーが発生しました",
          message: "プレイヤーの作成に失敗しました",
          color: "red",
          autoClose: 9000,
          withCloseButton: true,
        });
      }
    });
  };

  return (
    <Flex direction="column" gap="sm">
      <TextInput
        label="氏名"
        onChange={(v) => setPlayerName(v.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="越山識"
        ref={nameInputRef}
        value={playerName}
        disabled={isPending}
      />
      <TextInput
        label="順位"
        onChange={(v) => setPlayerText(v.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="24th"
        value={playerText}
        disabled={isPending}
      />
      <TextInput
        label="所属"
        onChange={(v) => setPlayerBelong(v.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="文蔵高校"
        value={playerBelong}
        disabled={isPending}
      />
      <Button
        disabled={playerName === "" || isPending}
        leftSection={<IconCirclePlus />}
        onClick={addNewPlayer}
        size="md"
      >
        追加
      </Button>
    </Flex>
  );
};

export default CompactCreatePlayer;
