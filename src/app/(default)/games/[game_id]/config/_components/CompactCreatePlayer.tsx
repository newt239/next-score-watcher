import { useRef, useState } from "react";

import { Button, Flex, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import db from "@/utils/db";
import { GameDBPlayerProps } from "@/utils/types";

type Props = {
  game_id: string;
  players: GameDBPlayerProps[];
};

const CompactCreatePlayer: React.FC<Props> = ({ game_id, players }) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const [playerName, setPlayerName] = useState<string>("");
  const [playerText, setPlayerText] = useState<string>("");
  const [playerBelong, setPlayerBelong] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;
    if (!playerName) return;
    addNewPlayer();
  };

  const addNewPlayer = async () => {
    const player_id = await db(currentProfile).players.put({
      id: nanoid(),
      name: playerName,
      text: playerText,
      belong: playerBelong,
      tags: [],
    });
    await db(currentProfile).games.update(game_id, {
      players: [
        ...players,
        {
          id: player_id,
          name: playerName,
          initial_correct: 0,
          initial_wrong: 0,
          base_correct_point: 1,
          base_wrong_point: -1,
        } as GameDBPlayerProps,
      ],
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
  };

  return (
    <Flex className="flex-col gap-2">
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
        onChange={(v) => setPlayerText(v.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="24th"
        value={playerText}
      />
      <TextInput
        label="所属"
        onChange={(v) => setPlayerBelong(v.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="文蔵高校"
        value={playerBelong}
      />
      <Button
        disabled={playerName === ""}
        leftSection={<CirclePlus />}
        onClick={addNewPlayer}
        size="md"
      >
        追加
      </Button>
    </Flex>
  );
};

export default CompactCreatePlayer;
