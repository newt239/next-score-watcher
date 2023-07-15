type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.3.1": {
    feature: [
      "全員が失格状態の時問題番号のみ進行させる「スキップ」機能の追加",
      "試合ログ欄に問題と答えを表示",
    ],
    bugfix: [],
  },
};
