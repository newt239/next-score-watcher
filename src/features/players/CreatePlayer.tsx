import { useRef, useState } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import { css } from "@panda/css";
import db from "~/utils/db";
import { GameDBPlayerProps } from "~/utils/types";

const CreatePlayer: React.FC<{ from?: string }> = ({ from }) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const [playerOrder, setPlayerOrder] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [playerBelong, setPlayerBelong] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

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
    toast({
      title: "プレイヤーを作成しました",
      description: playerName,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setPlayerName("");
    setPlayerOrder("");
    setPlayerBelong("");
    nameInputRef.current?.focus();
  };

  return (
    <VStack h={["45vh", "45vh", "30vh"]} justifyContent="space-between">
      <Grid
        gap={3}
        templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)"]}
        w="full"
      >
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
            onChange={(v) => setPlayerOrder(v.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="24th"
            value={playerOrder}
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
      </Grid>
      <div
        className={css({
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        })}
      >
        <Button
          colorScheme="blue"
          disabled={playerName === ""}
          leftIcon={<CirclePlus />}
          onClick={addNewPlayer}
        >
          追加
        </Button>
      </div>
    </VStack>
  );
};

export default CreatePlayer;
