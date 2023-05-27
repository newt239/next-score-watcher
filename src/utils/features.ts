type Feature = {
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.2.0": {
    feature: [
      "形式の追加: backstream",
      "形式の追加: N○M休",
      "キーボードショートカットを13人目まで対応",
      "得点表示画面から表示設定を変更できるよう改善",
      "AQLルールでダブルリーチの際赤色のボーダーが表示されるよう改善",
    ],
    bugfix: [
      "形式一覧でSwedish10の説明文を修正",
      "形式NYの勝ち抜け判定を修正",
      "誤答数をバツの数で表示する設定が効かない不具合を修正",
    ],
  },
};
