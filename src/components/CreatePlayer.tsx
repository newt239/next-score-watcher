import { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  Input,
  FormLabel,
  Grid,
  useToast,
} from "@chakra-ui/react";

import H3 from "#/blocks/H3";
import db from "#/utils/db";

const CreatePlayer: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [playerBelong, setPlayerBelong] = useState<string>("");
  const toast = useToast();

  const addNewPlayer = async () => {
    await db.players.put({
      name: playerName,
      belong: playerBelong,
      tags: [],
    });
    toast({
      title: "ユーザーを作成しました",
      description: `${playerName}・${playerBelong}`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setPlayerName("");
    setPlayerBelong("");
  };

  return (
    <Box>
      <H3>新規作成</H3>
      <Grid
        py={5}
        gap={5}
        templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
      >
        <FormControl>
          <FormLabel>氏名</FormLabel>
          <Input
            value={playerName}
            onChange={(v) => setPlayerName(v.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>所属</FormLabel>
          <Input
            value={playerBelong}
            onChange={(v) => setPlayerBelong(v.target.value)}
          />
        </FormControl>
      </Grid>
      <Box sx={{ textAlign: "right" }}>
        <Button
          colorScheme="blue"
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
