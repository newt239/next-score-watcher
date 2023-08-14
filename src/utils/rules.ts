import { GamePropsUnion, RuleNames } from "#/utils/types";

type RuleProps = {
  [T in RuleNames]: {
    [U in keyof GamePropsUnion]?: GamePropsUnion[U];
  } & {
    name: string;
    description: string;
    rows: number;
  };
};

export const rules = {
  normal: {
    rule: "normal",
    name: "スコア計算",
    description: "スコアの計算を行います。",
    options: undefined,
    rows: 1,
  },
  nomx: {
    rule: "nomx",
    name: "N○M✕",
    description: "N回正解で勝ち抜け、M回誤答で失格の形式です。",
    win_point: 7,
    lose_point: 3,
    options: undefined,
    rows: 2,
  },
  "nomx-ad": {
    rule: "nomx-ad",
    name: "連答つきN○M✕",
    description: "同じプレイヤーが連続で正解するとスコアが+2される形式です。",
    win_point: 7,
    lose_point: 3,
    options: {
      streak_over3: true,
    },
    rows: 3,
  },
  ny: {
    rule: "ny",
    name: "NY",
    description: "正答で+1、誤答で-1されNポイントを目指す形式です。",
    win_point: 10,
    options: undefined,
    rows: 2,
  },
  nomr: {
    rule: "nomr",
    name: "N○M休",
    description: "N回の正答で勝ち抜けですが、誤答するごとにM回休みになります。",
    win_point: 7,
    lose_point: 3,
    options: undefined,
    rows: 2,
  },
  nbyn: {
    rule: "nbyn",
    name: "NbyN",
    description:
      "正答数と誤答数2つの変数を持ち、それぞれの初期値は0とNです。2つの変数の積がNの2乗に達したら勝ち抜けの形式です。",
    win_point: 5,
    lose_point: 5,
    options: undefined,
    rows: 3,
  },
  nupdown: {
    rule: "nupdown",
    name: "Nupdown",
    description:
      "N回正解で勝ち抜けですが、途中で一度でも誤答すると0に戻る形式です。",
    win_point: 5,
    lose_point: 2,
    options: undefined,
    rows: 2,
  },
  swedish10: {
    rule: "swedish10",
    name: "Swedish10",
    description:
      "10回の正答で勝ち抜けですが、誤答すると正答数が0の時1✕、1～2の時2✕、3～5の時3✕、6～9の時4✕が付与され、10✕以上で失格となります。",
    win_point: 10,
    lose_point: 10,
    options: undefined,
    rows: 2,
  },
  backstream: {
    rule: "backstream",
    name: "Backstream",
    description:
      "1回の正答で+1、n回目の誤答で-nで10を目指す形式です。-10になると失格となります。",
    win_point: 10,
    lose_point: -10,
    options: undefined,
    rows: 2,
  },
  attacksurvival: {
    rule: "attacksurvival",
    name: "アタックサバイバル",
    description:
      "プレイヤーは各自Nポイントを持った状態で開始します。正解すると他の回答者全員のポイントをXポイント減らすことができ、また誤答すると自分のポイントがYポイント減ります。ポイントが0になった時失格となります。",
    win_point: 15, // 初期値
    win_through: 3,
    correct_me: 0,
    wrong_me: -2,
    correct_other: -1,
    wrong_other: 0,
    options: undefined,
    rows: 2,
  },
  squarex: {
    rule: "squarex",
    name: "SquareX",
    description:
      "奇数問目と偶数問目の正解数をかけた数がX以上になれば勝ち抜けの形式です。",
    win_point: 16,
    options: undefined,
    rows: 3,
  },
  z: {
    rule: "z",
    name: "Z",
    description:
      "各プレイヤーはステージ1に立った状態でゲームを開始します。\nいずれかのプレイヤーがステージをクリアしたとき、全員の正解数と誤答数および失格状態をリセットし、ステージをクリアしたプレイヤーはステージを1進めます。\n各ステージの内容は次の通りです:\n・ステージ1:1回の正解でクリアです。誤答すると1問の間、解答権が剥奪されます\n・ステージ2:2回の正解でクリアです。1問の誤答で失格となります\n・ステージ3:3回の正解でクリアです。2間の誤答で失格となります\n・ステージ4:4回の正解でクリアです。3問の誤答で失格となります\nステージ5に到達すれば勝ち抜けです。既定の人数が勝ち抜けたときゲームを終了します。",
    options: undefined,
    rows: 2,
  },
  freezex: {
    rule: "freezex",
    name: "freezeX",
    description: "X問正解で勝ち抜け、N回目の誤答でN回休みの形式です。",
    win_point: 7,
    options: undefined,
    rows: 2,
  },
  variables: {
    rule: "variables",
    name: "Variables",
    description:
      "各プレイヤーは最初に好きな変動値Nを設定することができ、正解で+N、誤答で-N✕(N-2)されます。",
    win_point: 30,
    options: undefined,
    rows: 3,
  },
} as const satisfies RuleProps;

export const getRuleStringByType = (game: GamePropsUnion): string => {
  switch (game.rule) {
    case "normal":
      return "カウンター";
    case "nomx":
      return `${game.win_point}o${game.lose_point}x`;
    case "nomx-ad":
      return `連答つき${game.win_point}o${game.lose_point}x`;
    case "ny":
      return "NY";
    case "nomr":
      return `${game.win_point}○N休`;
    case "nbyn":
      return `${game.win_point}by${game.win_point}`;
    case "nupdown":
      return `${game.win_point}updown`;
    case "swedish10":
      return `Swedish10`;
    case "backstream":
      return "Backstream";
    case "attacksurvival":
      return "アタックサバイバル";
    case "squarex":
      return `Square${game.win_point}`;
    case "z":
      return "Z";
    case "freezex":
      return `freeze${game.win_point}`;
    case "variables":
      return `Variables`;
    default:
      return "unknown";
  }
};
