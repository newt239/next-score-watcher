import { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  Input,
  FormLabel,
  Grid,
  useToast,
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";

import db from "#/utils/db";

const CreatePlayer: React.FC = () => {
  const [playerOrder, setPlayerOrder] = useState<string>("0");
  const [playerName, setPlayerName] = useState<string>("");
  const [playerBelong, setPlayerBelong] = useState<string>("");
  const toast = useToast();

  const addNewPlayer = async () => {
    await db.players.put({
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
    setPlayerOrder("");
    setPlayerBelong("");
  };

  return (
    <Box>
      <Grid gap={5} templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
        <FormControl>
          <FormLabel>氏名</FormLabel>
          <Input
            value={playerName}
            onChange={(v) => setPlayerName(v.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>サブテキスト</FormLabel>
          <NumberInput
            value={playerOrder}
            onChange={(v) => setPlayerOrder(v)}
          />
          <NumberInput>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>所属</FormLabel>
          <Input
            value={playerBelong}
            onChange={(v) => setPlayerBelong(v.target.value)}
          />
        </FormControl>
      </Grid>
      <Box sx={{ textAlign: "right", pt: 3 }}>
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
