import { ChangeEventHandler } from "react";

import { FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";

import db from "#/utils/db";

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
      csvRows.map((row) => {
        const values = row.split(",");
        return {
          q: values[0],
          a: values[1],
          set_name: setName,
        };
      })
    );
    return csvRows.length;
  };

  return (
    <FormControl>
      <FormLabel>ファイルから読み込み</FormLabel>
      <Input
        type="file"
        accept=".csv"
        onChange={handleOnChange}
        disabled={setName === ""}
      />
    </FormControl>
  );
};

export default ImportQuiz;
