type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.6.2": {
    feature: ["ショートカットキーがテンキーでも動作するよう改善"],
    bugfix: [
      "連答つきN○M✕で他人の誤答時やスルー時に連答権がなくなる不具合を修正",
      "AQLルール画面におけるレイアウトの不具合を修正",
    ],
  },
};
