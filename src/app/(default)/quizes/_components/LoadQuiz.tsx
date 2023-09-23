import React, { useRef, useState } from "react";

import { Radio, RadioGroup } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { CirclePlus } from "tabler-icons-react";

import Button from "#/app/_components/Button";
import Textarea from "#/app/_components/Textarea";
import db from "#/utils/db";
import { str2num } from "#/utils/functions";
import { Database } from "#/utils/schema";
import { QuizDBProps } from "#/utils/types";
import { css } from "@panda/css";

const LoadQuiz: React.FC<{ setName: string }> = ({ setName }) => {
  const supabase = createClientComponentClient<Database>();

  const [rawQuizText, setRawQuizText] = useState("");
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = async () => {
    if (rawQuizText !== "") {
      const quizRaw = rawQuizText.split("\n");
      let dataArray: QuizDBProps[] = [];
      for (let i = 0; i < quizRaw.length; i++) {
        const n = quizRaw[i].split(separateType === "comma" ? "," : "\t")[0];
        const q =
          quizRaw[i].split(separateType === "comma" ? "," : "\t")[1] || "";
        const a =
          quizRaw[i].split(separateType === "comma" ? "," : "\t")[2] || "";
        if (n !== "") {
          dataArray.push({
            id: nanoid(),
            n: str2num(n),
            q,
            a,
            set_name: setName,
          });
        }
      }
      await supabase.from("quizes").insert(dataArray);
      await db.quizes.bulkPut(dataArray);
      if (dataArray.length !== 0) {
        toast("データをインポートしました");
      }
      setRawQuizText("");
      textareaRef.current?.focus();
    }
  };

  const joinString = separateType === "tab" ? "	" : ",";
  const placeholderText = `1${joinString}選挙において、支持する政党や候補者が一定していない有権者が持つ票のことを、漢字３文字で何というでしょう？${joinString}浮動票
2${joinString}1989年、小学校1・2年生の理科と社会に代わって導入された科目は何でしょう？${joinString}生活〈科〉
  `;

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        h: "30vh",
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
          disabled={setName === ""}
          onChange={(e) => setRawQuizText(e.target.value)}
          placeholder={placeholderText}
          ref={textareaRef}
          sx={{ flexGrow: 1 }}
          value={rawQuizText}
        />
        <p>A列: 問題番号、 B列: 問題文 C列: 答え</p>
      </div>
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
          disabled={rawQuizText === ""}
          leftIcon={<CirclePlus />}
          onClick={handleClick}
        >
          追加
        </Button>
      </div>
    </div>
  );
};

export default LoadQuiz;
