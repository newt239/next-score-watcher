import { Link } from "@chakra-ui/react";

type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.4.2": {
    news: (
      <>
        <p>
          <b>アンケートを実施しています</b>:{" "}
          <Link
            href="https://forms.gle/T6CGBZntoGAiQSxH9"
            sx={{ color: "blue.500" }}
          >
            こちらのリンク
          </Link>
          からご回答いただけます。今後のアップデートの参考とするためにご協力いただけると幸いです。
        </p>
      </>
    ),
    feature: [
      "「スコアの手動更新」モードの際問題番号を変更できるように",
      "最大勝ち抜け人数がプレイ人数より大きいとき警告を表示するように",
    ],
    bugfix: [
      "ショートカット機能が意図せず動作してしまう不具合を修正",
      "スキップガイドが正しいタイミングで表示されない不具合を修正",
      "プレイヤーやクイズのインポート時文字化けが起きる不具合を修正",
    ],
  },
};
