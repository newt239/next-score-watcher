import { ChangeEventHandler } from "react";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";

import db from "#/utils/db";
import { str2num } from "#/utils/functions";

const ImportQuiz: React.FC<{ setName: string }> = ({ setName }) => {
  const toast = useToast();

  const fileReader = new FileReader();

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files) {
      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = (ev) => {
        const csvOutput = ev.target?.result;
        if (typeof csvOutput === "string") {
          csvFileToArray(csvOutput).then((row) => {
            toast({
              title: "データをインポートしました",
              description: `${files[0].name}から${row}件の問題を読み込みました`,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          });
        }
      };
    }
  };

  const csvFileToArray = async (raw: string) => {
    const csvRows = raw.split("\n");
    await db.quizes.bulkPut(
      csvRows
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
        .filter((row) => row.q !== "")
    );
    return csvRows.length;
  };

  return (
    <FormControl>
      <FormLabel>CSVファイルからインポートできます。</FormLabel>
      <Input
        type="file"
        accept=".csv"
        onChange={handleOnChange}
        disabled={setName === ""}
        height={100}
      />
      <FormHelperText>
        1列目: 問題番号、 2列目: 問題文 3列目: 答え
      </FormHelperText>
    </FormControl>
  );
};

export default ImportQuiz;
