type Feature = {
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.0.0": {
    feature: [
      "ページ読み込み速度の改善",
      "誤答数を✕の数で表示するオプションを追加（アプリ設定から変更できます）",
      "スコアの文字の大きさを改善",
      "垂直ビューで名前やスコアの横幅を統一",
    ],
    bugfix: ["SquareXで誤答数が変わらない不具合不具合を修正"],
  },
};
