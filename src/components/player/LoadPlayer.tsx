import { ChangeEventHandler, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import CreatePlayer from "./CreatePlayer";

import H3 from "#/blocks/H3";
import db, { PlayerDBProps } from "#/utils/db";

const LoadPlayer: React.FC = () => {
  const toast = useToast();
  const [rawQuizText, setRawQuizText] = useState("");
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");

  const fileReader = new FileReader();

  const handleClick = async () => {
    if (rawQuizText !== "") {
      const playerRaw = rawQuizText.split("\n");
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
        dataArray.push({ name, text, belong, tags: [] });
      }
      await db.players.bulkPut(dataArray);
      toast({
        title: "データをインポートしました",
        description: `直接入力から${dataArray.length}件の問題を読み込みました`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setRawQuizText("");
    }
  };

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files) {
      fileReader.onload = (ev) => {
        const csvOutput = ev.target?.result;
        if (typeof csvOutput === "string") {
          csvFileToArray(csvOutput).then((row) => {
            toast({
              title: "データをインポートしました",
              description: `${files[0].name}から${row}件のプレイヤーデータを読み込みました`,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          });
        }
      };
      fileReader.readAsText(files[0], "Shift_JIS");
    }
  };

  const csvFileToArray = async (raw: string) => {
    const csvRows = raw.split("\n");
    await db.players.bulkPut(
      csvRows.map((row) => {
        const values = row.split(",");
        return {
          name: values[0],
          text: values[1],
          belong: values[2],
          tags: [],
        };
      })
    );
    return csvRows.length;
  };

  return (
    <Box>
      <H3>プレイヤーの読み込み</H3>
      <Tabs isFitted variant="enclosed" pt={5}>
        <TabList mb="1em">
          <Tab>新規追加</Tab>
          <Tab>貼り付け</Tab>
          <Tab>インポート</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CreatePlayer />
          </TabPanel>
          <TabPanel>
            <Box>
              <FormControl>
                <FormLabel>直接貼り付け</FormLabel>
                <Textarea
                  value={rawQuizText}
                  onChange={(e) => setRawQuizText(e.target.value)}
                />
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
                  disabled={rawQuizText === ""}
                >
                  追加
                </Button>
              </HStack>
            </Box>
          </TabPanel>
          <TabPanel>
            <FormControl>
              <FormLabel>インポート</FormLabel>
              <Input type="file" accept=".csv" onChange={handleOnChange} />
            </FormControl>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default LoadPlayer;
