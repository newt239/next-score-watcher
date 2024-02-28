import { ChangeEventHandler } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Encoding from "encoding-japanese";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

import { Database } from "../../../../../supabase/schema";

import db from "#/utils/db";
import { str2num } from "#/utils/functions";
import { css } from "@panda/css";

const ImportQuiz: React.FC<{ setName: string }> = ({ setName }) => {
  const supabase = createClientComponentClient<Database>();

  const fileReader = new FileReader();

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files) {
      fileReader.onload = (ev) => {
        const buffer = ev.target?.result;
        if (buffer instanceof ArrayBuffer) {
          const unicodeArray = Encoding.convert(new Uint8Array(buffer), {
            from: "AUTO",
            to: "UNICODE",
          });
          const encodedString = Encoding.codeToString(unicodeArray);
          csvFileToArray(encodedString).then((row) => {
            toast("データをインポートしました");
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
          a: values[2] || "",
          id: nanoid(),
          n: str2num(values[0]),
          q: values[1] || "",
          set_name: setName,
        };
      })
      .filter((row) => row.q !== "");
    await supabase.from("quizes").insert(filteredRows);
    await db.quizes.bulkPut(filteredRows);
    return filteredRows.length;
  };

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        h: "30vh",
        justifyContent: "space-between",
      })}
    >
      <p>CSVファイルからインポートできます。</p>
      <input
        accept=".csv"
        className={css({ flexGrow: 1, height: 100 })}
        disabled={setName === ""}
        onChange={handleOnChange}
        type="file"
      />
      <p>1列目: 問題番号、 2列目: 問題文 3列目: 答え</p>
    </div>
  );
};

export default ImportQuiz;
