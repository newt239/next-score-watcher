import { Link } from "@chakra-ui/react";

type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.4.1": {
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
    feature: ["連答つきN○M✕でabcの新ルールに対応", "AQLページのデザインを改善"],
    bugfix: [
      "「スコアの手動更新」でプレイヤーカラー変更ポップアップの文字を読みやすく",
    ],
  },
};
