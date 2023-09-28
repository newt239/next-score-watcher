"use client";

import { useRef, useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { CirclePlus } from "tabler-icons-react";

import Button from "#/app/_components/Button";
import FormControl from "#/app/_components/FormControl";
import TextInput from "#/app/_components/TextInput";
import db from "#/utils/db";
import { Database } from "#/utils/schema";
import { GameDBPlayerProps } from "#/utils/types";
import { css } from "@panda/css";

const CreatePlayer: React.FC<{ from?: string }> = ({ from }) => {
  const supabase = createClientComponentClient<Database>();
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
    const player_id = nanoid();
    const result = await supabase.from("players").insert({
      id: player_id,
      name: playerName,
      order: playerOrder,
      belong: playerBelong,
    });
    console.log(result);
    if (from) {
      const game = await db.games.get(from);
      if (game) {
        await db.games.update(from, {
          players: [
            //  ...game.players,
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
      }
    }
    toast.success("プレイヤーを作成しました");
    setPlayerName("");
    setPlayerOrder("");
    setPlayerBelong("");
    nameInputRef.current?.focus();
  };

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        h: ["45vh", "45vh", "30vh"],
      })}
    >
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: [
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
          ],
          w: "100%",
          gap: "16px",
        })}
      >
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
            onChange={(v) => setPlayerOrder(v.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="24th"
            value={playerOrder}
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
      </div>
      <div
        className={css({
          textAlign: "right",
          w: "full",
        })}
      >
        <Button
          disabled={playerName === ""}
          leftIcon={<CirclePlus />}
          onClick={addNewPlayer}
        >
          追加
        </Button>
      </div>
    </div>
  );
};

export default CreatePlayer;
