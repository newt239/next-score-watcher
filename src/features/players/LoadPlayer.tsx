import { useRef, useState } from "react";

import { Button, Radio, RadioGroup, VStack, useToast } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import db from "#/utils/db";
import { PlayerDBProps } from "#/utils/types";
import { css } from "@panda/css";

const LoadPlayer: React.FC = () => {
  const toast = useToast();
  const [rawPlayerText, setRawPlayerText] = useState("");
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = async () => {
    if (rawPlayerText !== "") {
      const playerRaw = rawPlayerText.split("\n");
      let dataArray: PlayerDBProps[] = [];
      for (let i = 0; i < playerRaw.length; i++) {
        const name = playerRaw[i].split(
          separateType === "comma" ? "," : "\t"
        )[0];
        const text =
          playerRaw[i].split(separateType === "comma" ? "," : "\t")[1] || "";
        const belong =
          playerRaw[i].split(separateType === "comma" ? "," : "\t")[2] || "";
        if (name !== "") {
          dataArray.push({ id: nanoid(), name, text, belong, tags: [] });
        }
      }
      await db.players.bulkPut(dataArray);
      if (dataArray.length !== 0) {
        toast({
          title: "データをインポートしました",
          description: `直接入力から${dataArray.length}件の問題を読み込みました`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      setRawPlayerText("");
      textareaRef.current?.focus();
    }
  };

  const joinString = separateType === "tab" ? "	" : ",";
  const placeholderText = `越山識${joinString}24th${joinString}文蔵高校
深見真理${joinString}9th${joinString}文蔵高校
  `;

  return (
    <VStack
      h={["45vh", "45vh", "30vh"]}
      justifyContent="space-between"
      w="full"
    >
      <VStack align="left" className={css({ flexGrow: 1 })} w="full">
        <p>Excelやスプレッドシートからコピーし、まとめてインポートできます。</p>
        <textarea
          className={css({ flexGrow: 1 })}
          onChange={(e) => setRawPlayerText(e.target.value)}
          placeholder={placeholderText}
          ref={textareaRef}
          value={rawPlayerText}
        />
        <p>A列: 氏名、 B列: 順位、 C列: 所属</p>
      </VStack>
      <div
        className={css({
          pt: 3,
          gap: 3,
          justifyContent: "flex-end",
          width: "100%",
        })}
      >
        <RadioGroup
          onChange={(e) => setSparateType(e as "tab" | "comma")}
          value={separateType}
        >
          <div className={css({ display: "flex", flexDirection: "row" })}>
            <Radio value="comma">カンマ区切り</Radio>
            <Radio value="tab">タブ区切り</Radio>
          </div>
        </RadioGroup>
        <Button
          colorScheme="blue"
          disabled={rawPlayerText === ""}
          leftIcon={<CirclePlus />}
          onClick={handleClick}
        >
          追加
        </Button>
      </div>
    </VStack>
  );
};

export default LoadPlayer;
