export const rules = {
  normal: {
    name: "スコア計算",
    description: "単純なスコアを計算します。",
  },
  nomx: {
    name: "NoMx",
    description: "N回正解で勝ち抜け、M回誤答で失格の形式です。",
    win_point: 7,
    lose_point: 3,
  },
  nbyn: {
    name: "NbyN",
    description:
      "正答数と誤答数2つの変数を持ち、それぞれの初期値は0とNです。2つの変数の積がN ** 2に達したら勝ち抜けの形式です。",
    win_point: 5,
  },
};
