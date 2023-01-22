import { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";

import db, { PlayerDBProps } from "#/utils/db";

const LoadPlayer: React.FC = () => {
  const toast = useToast();
  const [rawPlayerText, setRawPlayerText] = useState("");
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");

  const handleClick = async () => {
    if (rawPlayerText !== "") {
      const playerRaw = rawPlayerText.split("\n");
      let dataArray: PlayerDBProps[] = [];
      for (let i = 0; i < playerRaw.length; i++) {
        const name = playerRaw[i].split(
          separateType === "comma" ? "," : "\t"
        )[0];
        const text = playerRaw[i].split(
          separateType === "comma" ? "," : "\t"
        )[1];
        const belong = playerRaw[i].split(
          separateType === "comma" ? "," : "\t"
        )[2];
        dataArray.push({ id: nanoid(), name, text, belong, tags: [] });
      }
      await db.players.bulkPut(dataArray);
      toast({
        title: "データをインポートしました",
        description: `直接入力から${dataArray.length}件の問題を読み込みました`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setRawPlayerText("");
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>
          Excelやスプレッドシートからコピーし、まとめてインポートできます。
        </FormLabel>
        <Textarea
          value={rawPlayerText}
          onChange={(e) => setRawPlayerText(e.target.value)}
          placeholder={"越山識,24th,文蔵高校".replaceAll(
            ",",
            separateType === "tab" ? "	" : ","
          )}
          height={100}
        />
        <FormHelperText>
          A列: 氏名、 B列: サブテキスト、 C列: 所属
        </FormHelperText>
      </FormControl>
      <HStack sx={{ pt: 3, gap: 3, justifyContent: "flex-end" }}>
        <RadioGroup
          onChange={(e) => setSparateType(e as "tab" | "comma")}
          value={separateType}
        >
          <Stack direction="row">
            <Radio value="comma">カンマ区切り</Radio>
            <Radio value="tab">タブ区切り</Radio>
          </Stack>
        </RadioGroup>
        <Button
          colorScheme="blue"
          onClick={handleClick}
          disabled={rawPlayerText === ""}
        >
          追加
        </Button>
      </HStack>
    </Box>
  );
};

export default LoadPlayer;
