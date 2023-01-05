import { ChangeEventHandler, useState } from "react";

import {
  Alert,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";

import H3 from "#/blocks/H3";
import db from "#/utils/db";

const LoadQuiz: React.FC = () => {
  const [setName, setSetName] = useState<string>("");
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
    <Box>
      <H3>ファイルから読み込み</H3>
      <Stack>
        <Alert status="info" my={3}>
          CSV形式(カンマ区切り)で 1列目に問題文、2列目に答えを入力してください。
        </Alert>
        <FormControl>
          <FormLabel>セット名</FormLabel>
          <Input
            value={setName}
            isInvalid={setName === ""}
            errorBorderColor="crimson"
            onChange={(e) => setSetName(e.target.value)}
          />
        </FormControl>
        <Box py={5}>
          <Input
            type="file"
            accept=".csv"
            onChange={handleOnChange}
            disabled={setName === ""}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default LoadQuiz;
