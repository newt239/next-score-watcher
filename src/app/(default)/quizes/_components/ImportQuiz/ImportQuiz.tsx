"use client";

import { Flex, Text } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import Encoding from "encoding-japanese";
import { nanoid } from "nanoid";

import classes from "./ImportQuiz.module.css";

import Dropzone from "@/app/_components/Dropzone/Dropzone";
import db from "@/utils/db";
import { str2num } from "@/utils/functions";

type Props = {
  set_name: string;
  currentProfile: string;
};

const ImportQuiz: React.FC<Props> = ({ set_name, currentProfile }) => {
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
              event: "import_quiz",
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
          n: str2num(values[0]),
          q: values[1] || "",
          a: values[2] || "",
          set_name,
        };
      })
      .filter((row) => row.q !== "");
    await db(currentProfile).quizes.bulkPut(filteredRows);
    return filteredRows.length;
  };

  return (
    <Flex className={classes.import_quiz}>
      <Dropzone disabled={set_name === ""} onDrop={handleOnChange} />
      <Text>1列目: 問題番号、 2列目: 問題文 3列目: 答え</Text>
    </Flex>
  );
};

export default ImportQuiz;
