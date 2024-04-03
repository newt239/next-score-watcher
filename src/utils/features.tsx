type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.5.1": {
    feature: [
      "プロファイルの切り替え機能を追加: デスクトップ画面左下の「デフォルト」から切り替えることができます。",
      "形式の追加: エンドレスチャンス",
      "形式の追加: Divide",
    ],
    bugfix: [],
  },
};
