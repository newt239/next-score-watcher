type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.4.1": {
    feature: ["連答つきN○M✕でabcの新ルールに対応", "AQLページのデザインを改善"],
    bugfix: [
      "「スコアの手動更新」でプレイヤーカラー変更ポップアップの文字を読みやすく",
    ],
  },
};
