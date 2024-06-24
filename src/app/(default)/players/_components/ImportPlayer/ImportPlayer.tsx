"use client";

import { Flex, Text } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import Encoding from "encoding-japanese";
import { nanoid } from "nanoid";

import classes from "./ImportPlayer.module.css";

import Dropzone from "@/app/_components/Dropzone/Dropzone";
import db from "@/utils/db";

export default function ImportPlayer() {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
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
    <Flex className={classes.import_player}>
      <Dropzone onDrop={handleOnChange} />
      <Text>1列目: 氏名、 2列目: 順位、 3列目: 所属</Text>
    </Flex>
  );
}
