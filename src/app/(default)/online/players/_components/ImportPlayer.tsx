"use client";

import { useTransition } from "react";

import { Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Encoding from "encoding-japanese";

import type { CreatePlayerType } from "@/models/player";
import type { FileWithPath } from "@mantine/dropzone";

import Dropzone from "@/app/_components/Dropzone/Dropzone";

type Props = {
  createPlayers: (playersData: CreatePlayerType[]) => Promise<number>;
};

/**
 * CSVインポートによるプレイヤー一括作成コンポーネント
 */
const ImportPlayer: React.FC<Props> = ({ createPlayers }) => {
  const [isPending, startTransition] = useTransition();

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

          startTransition(async () => {
            const createdCount = await csvFileToArray(encodedString);
            notifications.show({
              title: "データをインポートしました",
              message: `${file.name}から${createdCount}件のプレイヤーデータを読み込みました`,
              autoClose: 9000,
              withCloseButton: true,
            });
          });
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const csvFileToArray = async (raw: string) => {
    const csvRows = raw.split("\n");
    const playersData: CreatePlayerType[] = [];

    for (const row of csvRows) {
      const values = row.split(",");
      const name = values[0]?.trim();
      const affiliation = values[1]?.trim() || undefined;

      if (name) {
        playersData.push({
          name,
          affiliation: affiliation || "",
          description: "",
        });
      }
    }

    if (playersData.length === 0) {
      throw new Error("有効なプレイヤーデータがありません");
    }

    return await createPlayers(playersData);
  };

  return (
    <Flex direction="column" gap="md" style={{ paddingTop: "1rem" }}>
      <Dropzone
        onDrop={handleOnChange}
        accept={["text/csv"]}
        loading={isPending}
      />
      <Text>1列目: 氏名、 2列目: 所属</Text>
    </Flex>
  );
};

export default ImportPlayer;
