import { ChangeEventHandler } from "react";

import { Box, Input, Stack, Text, useToast } from "@chakra-ui/react";

import H3 from "#/blocks/H3";
import db from "#/utils/db";

const LoadPlayer: React.FC = () => {
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
      csvRows.map((row) => {
        const values = row.split(",");
        return {
          name: values[0],
          belong: values[1],
          tags: [],
        };
      })
    );
    return csvRows.length;
  };

  return (
    <Box>
      <H3>ファイルから読み込み</H3>
      <Stack gap={3} py={3}>
        <Text>
          CSV形式(カンマ区切り)で 1列目に氏名、2列目に所属を入力してください。
        </Text>
        <Box>
          <Input type="file" accept=".csv" onChange={handleOnChange} />
        </Box>
      </Stack>
    </Box>
  );
};

export default LoadPlayer;
