import { useRef, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  Input,
  FormLabel,
  Grid,
  useToast,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import db from "#/utils/db";

const CreatePlayer: React.FC = () => {
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
    await db.players.put({
      id: nanoid(),
      name: playerName,
      text: playerOrder,
      belong: playerBelong,
      tags: [],
    });
    toast({
      title: "ユーザーを作成しました",
      description: `${playerOrder}・${playerBelong}`,
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
    <Box>
      <Grid gap={5} templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
        <FormControl>
          <FormLabel>氏名</FormLabel>
          <Input
            value={playerName}
            onChange={(v) => setPlayerName(v.target.value)}
            placeholder="越山識"
            ref={nameInputRef}
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <FormControl>
          <FormLabel>サブテキスト</FormLabel>
          <Input
            value={playerOrder}
            onChange={(v) => setPlayerOrder(v.target.value)}
            placeholder="24th"
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <FormControl>
          <FormLabel>所属</FormLabel>
          <Input
            value={playerBelong}
            onChange={(v) => setPlayerBelong(v.target.value)}
            placeholder="文蔵高校"
            onKeyDown={handleKeyDown}
          />
        </FormControl>
      </Grid>
      <Box sx={{ textAlign: "right", pt: 3 }}>
        <Button
          colorScheme="blue"
          leftIcon={<CirclePlus />}
          onClick={addNewPlayer}
          disabled={playerName === ""}
        >
          追加
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePlayer;
