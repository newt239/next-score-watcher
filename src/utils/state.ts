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
  nupdown: {
    name: "Nupdown",
    description:
      "N回正解で勝ち抜けですが、途中で一度でも誤答すると0に戻る形式です。",
    win_point: 5,
    lose_point: 2,
  },
  swedishx: {
    name: "SwedishX",
    description: "1回の正答で+1,n回目の誤答で-nでXを目指す形式です。",
    win_point: 5,
  },
  attacksurvival: {
    name: "Attack Survival",
    description: "アタックサバイバル",
    win_point: 15, // 初期値
    win_through: 3,
    correct_me: 0,
    wrong_me: -2,
    correct_other: -1,
    wrong_other: 0,
  },
  squarex: {
    name: "Square X",
    description:
      "奇数問目と偶数問目の正解数をかけた数がX以上になれば勝ち抜けの形式です。",
    win_point: 16,
  },
  z: {
    name: "Z",
    description: "Z",
  },
  freezx: {
    name: "freez X",
    description: "X問正解で勝ち抜け、N回目の誤答でN回休み。",
    win_point: 7,
  },
};
