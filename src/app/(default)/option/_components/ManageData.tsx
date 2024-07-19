"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import Encoding from "encoding-japanese";
import { nanoid } from "nanoid";

import db from "@/utils/db";

type Props = {
  currentProfile: string;
};

const ManageData: React.FC<Props> = ({ currentProfile }) => {
  const [input, setInput] = useState<string>("");

  const exportGameData = async () => {
    const data = {
      games: await db(currentProfile).games.toArray(),
      players: await db(currentProfile).players.toArray(),
      quizes: await db(currentProfile).quizes.toArray(),
      logs: await db(currentProfile).logs.toArray(),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProfile}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOnChange = (files: FileWithPath[]) => {
    const fileReader = new FileReader();
    if (files && files.length > 0) {
      const file = files[0];
      fileReader.onload = (ev) => {
        const buffer = ev.target?.result;
        if (buffer instanceof ArrayBuffer) {
          const unicodeArray = Encoding.convert(new Uint8Array(buffer), {
            to: "UNICODE",
            from: "AUTO",
          });
          const encodedString = Encoding.codeToString(unicodeArray);
          csvFileToArray(encodedString).then((row) => {
            notifications.show({
              title: "データをインポートしました",
              message: `${file.name}から${row}件のプレイヤーデータを読み込みました`,
              autoClose: 9000,
              withCloseButton: true,
            });
            sendGAEvent({
              event: "import_profile",
              value: row,
            });
          });
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const csvFileToArray = async (raw: string) => {
    const csvRows = raw.split("\n");
    const filteredRows = csvRows
      .map((row) => {
        const values = row.split(",");
        return {
          id: nanoid(),
          name: values[0] || "",
          text: values[1] || "",
          belong: values[2] || "",
          tags: [],
        };
      })
      .filter((row) => row.name !== "");
    await db(currentProfile).players.bulkPut(filteredRows);
    return filteredRows.length;
  };

  return (
    <>
      <Title order={3}>エクスポート</Title>
      <Text>
        ゲームデータ及びプレイヤーデータ、クイズ問題データをエクスポートします。
      </Text>
      <Group justify="flex-start" gap="1rem" mb="lg">
        <Button onClick={exportGameData} color="green">
          エクスポート
        </Button>
        <Text>現在のプロファイルのデータをエクスポートします。</Text>
      </Group>
      <Title order={3}>インポート</Title>
      <Stack gap="1rem" mb="lg">
        <TextInput
          label="プロファイル名"
          placeholder="〇〇パソコンのデータ"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Box>インポート機能は次のバージョンで実装します。</Box>
      </Stack>
    </>
  );
};

export default ManageData;
