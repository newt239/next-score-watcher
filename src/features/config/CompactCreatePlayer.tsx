import { useRef, useState } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import db from "#/utils/db";
import { GameDBPlayerProps } from "#/utils/types";

type CompactCreatePlayerProps = {
  game_id: string;
  players: GameDBPlayerProps[];
};

const CompactCreatePlayer: React.FC<CompactCreatePlayerProps> = ({
  game_id,
  players,
}) => {
  const toast = useToast();
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
    const player_id = await db.players.put({
      id: nanoid(),
      name: playerName,
      text: playerText,
      belong: playerBelong,
      tags: [],
    });
    await db.games.update(game_id, {
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
    toast({
      title: "プレイヤーを作成しました",
      description: playerName,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setPlayerName("");
    setPlayerText("");
    setPlayerBelong("");
    nameInputRef.current?.focus();
  };

  return (
    <Stack spacing={3}>
      <FormControl>
        <FormLabel>氏名</FormLabel>
        <Input
          onChange={(v) => setPlayerName(v.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="越山識"
          ref={nameInputRef}
          value={playerName}
        />
      </FormControl>
      <FormControl>
        <FormLabel>順位</FormLabel>
        <Input
          onChange={(v) => setPlayerText(v.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="24th"
          value={playerText}
        />
      </FormControl>
      <FormControl>
        <FormLabel>所属</FormLabel>
        <Input
          onChange={(v) => setPlayerBelong(v.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="文蔵高校"
          value={playerBelong}
        />
      </FormControl>
      <div className={css({ textAlign: "right" })}>
        <Button
          colorScheme="blue"
          disabled={playerName === ""}
          leftIcon={<CirclePlus />}
          onClick={addNewPlayer}
          size="sm"
        >
          追加
        </Button>
      </div>
    </Stack>
  );
};

export default CompactCreatePlayer;
