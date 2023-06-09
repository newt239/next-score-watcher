import { Link as ReactLink } from "react-router-dom";

import { Button } from "@chakra-ui/react";

type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.3.0": {
    news: (
      <p>
        <Button
          as={ReactLink}
          to="https://discord.gg/rct5sx6rbZ"
          color="blue.500"
          variant="link"
        >
          Discordサーバー
        </Button>
        を開設しました🎉Score
        Watcherに関する情報の発信や、操作方法に関する情報を交換する場としていく予定です。今後新機能の要望や不具合の報告などはここでも受け付けます！
      </p>
    ),
    feature: [
      "「限定問題数」「勝ち抜け人数」を設定する機能を追加：問題数到達時自動で判定が行われます",
      "ゲーム進行状況をDiscordに通知する機能を追加",
      "キーボードショートカットを特定のエリアのフォーカスをせずに動作するよう改善",
      "トップページを始めとする複数のページでUIを調整",
      "得点表示画面のメニュー項目の整理",
    ],
    bugfix: ["N○M休形式を修正", "AQL形式の表示情報の不具合を修正"],
  },
};
