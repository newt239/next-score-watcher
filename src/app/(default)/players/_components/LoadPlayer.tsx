"use client";

import { useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Radio,
  RadioGroup,
  Text,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import db from "@/utils/db";
import { PlayerDBProps } from "@/utils/types";

const LoadPlayer: React.FC = () => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const [rawPlayerText, setRawPlayerText] = useState("");
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = async () => {
    if (rawPlayerText !== "") {
      const playerRaw = rawPlayerText.split("\n");
      let dataArray: PlayerDBProps[] = [];
      for (let i = 0; i < playerRaw.length; i++) {
        const name = playerRaw[i].split(
          separateType === "comma" ? "," : "\t"
        )[0];
        const text =
          playerRaw[i].split(separateType === "comma" ? "," : "\t")[1] || "";
        const belong =
          playerRaw[i].split(separateType === "comma" ? "," : "\t")[2] || "";
        if (name !== "") {
          dataArray.push({ id: nanoid(), name, text, belong, tags: [] });
        }
      }
      await db(currentProfile).players.bulkPut(dataArray);
      if (dataArray.length !== 0) {
        notifications.show({
          title: "データをインポートしました",
          message: `直接入力から${dataArray.length}件の問題を読み込みました`,
          autoClose: 9000,
          withCloseButton: true,
        });
      }
      setRawPlayerText("");
      textareaRef.current?.focus();
    }
  };

  const joinString = separateType === "tab" ? "	" : ",";
  const placeholderText = `越山識${joinString}24th${joinString}文蔵高校
深見真理${joinString}9th${joinString}文蔵高校
  `;

  return (
    <Flex className="h-[45vh] flex-col justify-between lg:h-[30vh]">
      <Box>
        <Text>
          Excelやスプレッドシートからコピーし、まとめてインポートできます。
        </Text>
        <Textarea
          onChange={(e) => setRawPlayerText(e.target.value)}
          placeholder={placeholderText}
          ref={textareaRef}
          value={rawPlayerText}
        />
        <Text>A列: 氏名、 B列: 順位、 C列: 所属</Text>
      </Box>
      <Flex className="w-full justify-end gap-3 pt-3">
        <RadioGroup
          onChange={(e) => setSparateType(e as "tab" | "comma")}
          value={separateType}
        >
          <Flex direction="row">
            <Radio label="カンマ区切り" value="comma" />
            <Radio label="タブ区切り" value="tab" />
          </Flex>
        </RadioGroup>
        <Button
          disabled={rawPlayerText === ""}
          leftSection={<CirclePlus />}
          onClick={handleClick}
        >
          追加
        </Button>
      </Flex>
    </Flex>
  );
};

export default LoadPlayer;
