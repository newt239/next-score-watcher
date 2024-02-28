"use client";

import { useRef, useState } from "react";

import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { CirclePlus } from "tabler-icons-react";

import Button from "#/app/_components/Button";
import FormControl from "#/app/_components/FormControl";
import TextInput from "#/app/_components/TextInput";
import db from "#/utils/db";
import { GameDBPlayerProps, PlayerPropsOnSupabase } from "#/utils/types";
import { css } from "@panda/css";

type CompactCreatePlayerProps = {
  game_id: string;
  players: PlayerPropsOnSupabase[];
};

const CompactCreatePlayer: React.FC<CompactCreatePlayerProps> = ({
  game_id,
  players,
}) => {
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
      belong: playerBelong,
      id: nanoid(),
      name: playerName,
      order: playerText,
    });
    await db.games.update(game_id, {
      players: [
        ...players,
        {
          id: player_id,
          initial_correct: 0,
          initial_wrong: 0,
          name: playerName,
        } as GameDBPlayerProps,
      ],
    });
    toast("プレイヤーを作成しました");
    setPlayerName("");
    setPlayerText("");
    setPlayerBelong("");
    nameInputRef.current?.focus();
  };

  return (
    <div>
      <FormControl label="氏名">
        <TextInput
          onChange={(v) => setPlayerName(v.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="越山識"
          ref={nameInputRef}
          value={playerName}
        />
      </FormControl>
      <FormControl label="順位">
        <TextInput
          onChange={(v) => setPlayerText(v.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="24th"
          value={playerText}
        />
      </FormControl>
      <FormControl label="所属">
        <TextInput
          onChange={(v) => setPlayerBelong(v.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="文蔵高校"
          value={playerBelong}
        />
      </FormControl>
      <div className={css({ textAlign: "right" })}>
        <Button
          disabled={playerName === ""}
          leftIcon={<CirclePlus />}
          onClick={addNewPlayer}
          size="sm"
        >
          追加
        </Button>
      </div>
    </div>
  );
};

export default CompactCreatePlayer;
