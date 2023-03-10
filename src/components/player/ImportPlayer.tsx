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

const ImportPlayer: React.FC = () => {
  const toast = useToast();

  const fileReader = new FileReader();

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
      csvRows
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
        .filter((row) => row.name !== "")
    );
    return csvRows.length;
  };

  return (
    <FormControl>
      <FormLabel>CSVファイルからインポートできます。</FormLabel>
      <Input type="file" accept=".csv" onChange={handleOnChange} height={100} />
      <FormHelperText>
        1列目: 氏名、 2列目: サブテキスト、 3列目: 所属
      </FormHelperText>
    </FormControl>
  );
};

export default ImportPlayer;
