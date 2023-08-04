type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.3.2": {
    feature: ["プレイヤー名やスコアの幅や文字サイズを改善", "その他UIの調整"],
    bugfix: [],
  },
};
