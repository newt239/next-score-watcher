"use client";

import { FileInput, Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Encoding from "encoding-japanese";
import { nanoid } from "nanoid";

import db from "@/utils/db";
import { str2num } from "@/utils/functions";

type Props = {
  set_name: string;
};

const ImportQuiz: React.FC<Props> = ({ set_name }) => {
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
          n: str2num(values[0]),
          q: values[1] || "",
          a: values[2] || "",
          set_name,
        };
      })
      .filter((row) => row.q !== "");
    await db().quizes.bulkPut(filteredRows);
    return filteredRows.length;
  };

  return (
    <Flex className="h-[45vh] flex-col justify-between lg:h-[30vh]">
      <Text>CSVファイルからインポートできます。</Text>
      <FileInput
        accept=".csv"
        disabled={set_name === ""}
        onChange={handleOnChange}
        className="h-[255px] grow sm:h-[160px] lg:h-[100px]"
      />
      <Text>1列目: 問題番号、 2列目: 問題文 3列目: 答え</Text>
    </Flex>
  );
};

export default ImportQuiz;
