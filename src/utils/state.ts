const state = {
  rules: {
    normal: {
      name: "スコア計算",
      description: "単純なスコアを計算します。",
      count: 1,
    },
    nomx: {
      name: "NoMx",
      description: "N回正解で勝ち抜け、M回誤答で失格の形式です。",
      count: 3,
      win_point: 7,
      lose_point: 3,
    },
  },
};
export default state;
