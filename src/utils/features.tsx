type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.4.3": {
    feature: [
      "NY、N○M休、NbyN、Nupdown、Swedish10、backstreamでプレイヤーごとに初期値を変更できるように",
      "プレイヤー名中の半角英数字が強制的に全角で表示されるように",
      "フルスクリーンモード",
    ],
    bugfix: [
      "個人設定が反映されない不具合を修正",
      "モバイル端末で個人設定のポップオーバーが開けない問題を改善",
    ],
  },
};
