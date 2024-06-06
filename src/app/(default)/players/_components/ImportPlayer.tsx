"use client";

import { FileInput, Flex, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Encoding from "encoding-japanese";
import { nanoid } from "nanoid";

import db from "@/utils/db";

export default function ImportPlayer() {
  const [currentProfile] = useLocalStorage({
    key: "scorew_current_profile",
    defaultValue: "score_watcher",
  });

  const handleOnChange = (file: File | null) => {
    const fileReader = new FileReader();
    if (file) {
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
    <Flex className="h-[45vh] flex-col justify-between lg:h-[30vh]">
      <Text>CSVファイルからインポートできます。</Text>
      <FileInput
        accept=".csv"
        onChange={handleOnChange}
        className="h-[255px] grow sm:h-[160px] lg:h-[100px]"
      />
      <Text>1列目: 氏名、 2列目: 順位、 3列目: 所属</Text>
    </Flex>
  );
}
