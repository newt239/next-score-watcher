"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { Button, Flex, Group, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus } from "@tabler/icons-react";
import { nanoid } from "nanoid";

import classes from "./CreatePlayer.module.css";

import db from "@/utils/db";
import { GameDBPlayerProps } from "@/utils/types";

type Props = {
  currentProfile: string;
};

const CreatePlayer: React.FC<Props> = ({ currentProfile }) => {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [playerOrder, setPlayerOrder] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [playerBelong, setPlayerBelong] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;
    if (!playerName) return;
    addNewPlayer();
  };

  const addNewPlayer = async () => {
    const playerId = await db(currentProfile).players.put({
      id: nanoid(),
      name: playerName,
      text: playerOrder,
      belong: playerBelong,
      tags: [],
    });
    if (from) {
      const game = await db(currentProfile).games.get(from);
      if (game) {
        await db(currentProfile).games.update(from, {
          players: [
            ...game.players,
            {
              id: playerId,
              name: playerName,
              initial_correct: 0,
              initial_wrong: 0,
              base_correct_point: 1,
              base_wrong_point: -1,
            } as GameDBPlayerProps,
          ],
        });
      }
    }
    notifications.show({
      title: "プレイヤーを作成しました",
      message: playerName,
      autoClose: 5000,
      withCloseButton: true,
    });
    setPlayerName("");
    setPlayerOrder("");
    setPlayerBelong("");
    nameInputRef.current?.focus();
  };

  return (
    <Flex className={classes.create_player}>
      <Flex className={classes.create_player_forms}>
        <TextInput
          label="氏名"
          onChange={(v) => setPlayerName(v.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="越山識"
          ref={nameInputRef}
          value={playerName}
        />
        <TextInput
          label="順位"
          onChange={(v) => setPlayerOrder(v.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="24th"
          value={playerOrder}
        />
        <TextInput
          label="所属"
          onChange={(v) => setPlayerBelong(v.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="文蔵高校"
          value={playerBelong}
        />
      </Flex>
      <Group w="100%" justify="flex-end">
        <Button
          disabled={playerName === ""}
          leftSection={<IconCirclePlus />}
          onClick={addNewPlayer}
        >
          追加
        </Button>
      </Group>
    </Flex>
  );
};

export default CreatePlayer;
