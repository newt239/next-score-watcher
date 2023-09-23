"use client";

import { ChangeEventHandler } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Encoding from "encoding-japanese";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

import db from "#/utils/db";
import { Database } from "#/utils/schema";
import { css } from "@panda/css";

const ImportPlayer: React.FC = () => {
  const supabase = createClientComponentClient<Database>();

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
          id: nanoid(),
          name: values[0] || "",
          order: values[1] || "",
          belong: values[2] || "",
        };
      })
      .filter((row) => row.name !== "");
    await supabase.from("players").insert(filteredRows);
    await db.players.bulkPut(filteredRows);
    return filteredRows.length;
  };

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        h: ["45vh", "45vh", "30vh"],
      })}
    >
      <p>CSVファイルからインポートできます。</p>
      <input
        accept=".csv"
        className={css({ flexGrow: 1, height: [255, 160, 100] })}
        onChange={handleOnChange}
        type="file"
      />
      <p>1列目: 氏名、 2列目: 順位、 3列目: 所属</p>
    </div>
  );
};

export default ImportPlayer;
