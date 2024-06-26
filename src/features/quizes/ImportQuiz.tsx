import { ChangeEventHandler } from "react";

import { Input, Text, VStack, useToast } from "@chakra-ui/react";
import Encoding from "encoding-japanese";
import { nanoid } from "nanoid";

import db from "~/utils/db";
import { str2num } from "~/utils/functions";
import { recordEvent } from "~/utils/ga4";

const ImportQuiz: React.FC<{ setName: string }> = ({ setName }) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const toast = useToast();

  const fileReader = new FileReader();

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files) {
      fileReader.onload = (ev) => {
        const buffer = ev.target?.result;
        if (buffer instanceof ArrayBuffer) {
          const unicodeArray = Encoding.convert(new Uint8Array(buffer), {
            to: "UNICODE",
            from: "AUTO",
          });
          const encodedString = Encoding.codeToString(unicodeArray);
          csvFileToArray(encodedString).then((row) => {
            toast({
              title: "データをインポートしました",
              description: `${files[0].name}から${row}件の問題を読み込みました`,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            recordEvent({
              action: "import_quiz",
              category: "engagement",
              value: row,
            });
          });
        }
      };
      fileReader.readAsArrayBuffer(files[0]);
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
          set_name: setName,
        };
      })
      .filter((row) => row.q !== "");
    await db(currentProfile).quizes.bulkPut(filteredRows);
    return filteredRows.length;
  };

  return (
    <VStack align="left" h="30vh" justifyContent="space-between" w="full">
      <Text>CSVファイルからインポートできます。</Text>
      <Input
        accept=".csv"
        disabled={setName === ""}
        height={100}
        onChange={handleOnChange}
        sx={{ flexGrow: 1 }}
        type="file"
      />
      <Text>1列目: 問題番号、 2列目: 問題文 3列目: 答え</Text>
    </VStack>
  );
};

export default ImportQuiz;
