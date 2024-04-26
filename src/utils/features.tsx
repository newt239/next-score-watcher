type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.6.0": {
    feature: [
      "これまでに作成したゲームで選択されているプレイヤーをまとめて選択できるように",
      "ゲームのエクスポート機能を追加",
    ],
    bugfix: [
      "AQLルール画面における不具合を修正",
      "エンドレスチャンスにおける不具合を修正",
      "問題文が適切に表示されない不具合を修正",
    ],
  },
};
