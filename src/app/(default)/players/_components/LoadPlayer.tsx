"use client";

import { useRef, useState } from "react";

import { Radio, RadioGroup } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { CirclePlus } from "tabler-icons-react";

import Button from "#/app/_components/Button";
import Textarea from "#/app/_components/Textarea";
import db from "#/utils/db";
import { Database } from "#/utils/schema";
import { PlayerDBProps } from "#/utils/types";
import { css } from "@panda/css";

const LoadPlayer: React.FC = () => {
  const supabase = createClientComponentClient<Database>();
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
        const order =
          playerRaw[i].split(separateType === "comma" ? "," : "\t")[1] || "";
        const belong =
          playerRaw[i].split(separateType === "comma" ? "," : "\t")[2] || "";
        if (name !== "") {
          dataArray.push({ id: nanoid(), name, order, belong });
        }
      }
      await supabase.from("players").insert(dataArray);
      await db.players.bulkPut(dataArray);
      if (dataArray.length !== 0) {
        toast("データをインポートしました");
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
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        h: ["45vh", "45vh", "30vh"],
      })}
    >
      <div
        className={css({
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          w: "full",
        })}
      >
        <p>Excelやスプレッドシートからコピーし、まとめてインポートできます。</p>
        <Textarea
          onChange={(e) => setRawPlayerText(e.target.value)}
          placeholder={placeholderText}
          ref={textareaRef}
          sx={{ flexGrow: 1 }}
          value={rawPlayerText}
        />
        <p>A列: 氏名、 B列: 順位、 C列: 所属</p>
        <div
          className={css({
            display: "flex",
            pt: 3,
            gap: 3,
            justifyContent: "flex-end",
            w: "full",
          })}
        >
          <RadioGroup
            onChange={(e) => setSparateType(e as "tab" | "comma")}
            sx={{ display: "flex", flexDirection: "row" }}
            value={separateType}
          >
            <Radio value="comma">カンマ区切り</Radio>
            <Radio value="tab">タブ区切り</Radio>
          </RadioGroup>
          <Button
            disabled={rawPlayerText === ""}
            leftIcon={<CirclePlus />}
            onClick={handleClick}
          >
            追加
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoadPlayer;
