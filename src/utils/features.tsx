type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.4.0": {
    feature: [
      "ゲーム設定ページのUIを刷新",
      "ゲーム設定のみをコピーする機能を追加",
      "トップページの作成したゲーム一覧の表示を改善",
      "ゲーム設定ページのプレイヤー選択時のパフォーマンスを改善",
    ],
    bugfix: ["ゲーム開始後変更不可な設定が変更できてしまう不具合を修正"],
  },
};
