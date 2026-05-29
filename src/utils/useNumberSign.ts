"use client";

import { useCallback } from "react";

import { useLocalStorage } from "@mantine/hooks";

import { numberSign } from "@/utils/functions";

/**
 * 表示設定（showSignString・wrongNumber）を購読し、現在の設定で束縛した numberSign を返すフック。
 * 設定スイッチの変更が次の操作を待たずに即座に再描画へ反映される。
 * @returns スコアの表示文字列を生成する関数
 */
export const useNumberSign = () => {
  const [showSignString] = useLocalStorage({
    key: "showSignString",
    defaultValue: true,
  });
  const [wrongNumber] = useLocalStorage({
    key: "wrongNumber",
    defaultValue: true,
  });

  return useCallback(
    (type: "correct" | "wrong" | "pt", score?: number) =>
      numberSign(type, score, { showSignString, wrongNumber }),
    [showSignString, wrongNumber]
  );
};
