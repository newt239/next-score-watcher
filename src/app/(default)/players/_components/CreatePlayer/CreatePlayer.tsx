"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { Button, Flex, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import classes from "./CreatePlayer.module.css";

import db from "@/utils/db";
import { GameDBPlayerProps } from "@/utils/types";

const CreatePlayer: React.FC = () => {
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
    const playerId = await db().players.put({
      id: nanoid(),
      name: playerName,
      text: playerOrder,
      belong: playerBelong,
      tags: [],
    });
    if (from) {
      const game = await db().games.get(from);
      if (game) {
        await db().games.update(from, {
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
      autoClose: 9000,
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
      <Flex className="w-full justify-end">
        <Button
          disabled={playerName === ""}
          leftSection={<CirclePlus />}
          onClick={addNewPlayer}
        >
          追加
        </Button>
      </Flex>
    </Flex>
  );
};

export default CreatePlayer;
