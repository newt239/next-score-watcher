import { ChangeEventHandler } from "react";

import { Input, VStack, useToast } from "@chakra-ui/react";
import Encoding from "encoding-japanese";
import { nanoid } from "nanoid";

import db from "#/utils/db";
import { recordEvent } from "#/utils/ga4";
import { css } from "@panda/css";

const ImportPlayer: React.FC = () => {
  const toast = useToast();

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (files && files[0]) {
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
              description: `${files[0].name}から${row}件のプレイヤーデータを読み込みました`,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            recordEvent({
              action: "import_player",
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
          name: values[0] || "",
          text: values[1] || "",
          belong: values[2] || "",
          tags: [],
        };
      })
      .filter((row) => row.name !== "");
    await db.players.bulkPut(filteredRows);
    return filteredRows.length;
  };

  return (
    <VStack
      alignItems="left"
      h={["45vh", "45vh", "30vh"]}
      justifyContent="space-between"
      w="full"
    >
      <p>CSVファイルからインポートできます。</p>
      <Input
        accept=".csv"
        className={css({ flexGrow: 1 })}
        height={[255, 160, 100]}
        onChange={handleOnChange}
        type="file"
      />
      <p>1列目: 氏名、 2列目: 順位、 3列目: 所属</p>
    </VStack>
  );
};

export default ImportPlayer;
