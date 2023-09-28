type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.4.4": {
    feature: [
      "プレイヤーが10人以上の際、強制的に垂直ビューが表示されるよう変更",
      "プレイヤー選択時、初期並び順が選択した順になるよう変更",
    ],
    bugfix: [
      "設定画面におけるプレイヤー名のドラッグ&ドロップによる並び替え操作が反映されない不具合を修正",
      "限定問題数の設定欄で数字が入力不可になる不具合を修正",
    ],
  },
};
