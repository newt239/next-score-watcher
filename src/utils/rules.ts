import { GameDBProps } from "./db";

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
      "正答数と誤答数2つの変数を持ち、それぞれの初期値は0とNです。2つの変数の積がNの2乗に達したら勝ち抜けの形式です。",
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
    description:
      "プレイヤーは各自Nポイントを持った状態で開始します。正解すると他の回答者全員のポイントをXポイント減らすことができ、また誤答すると自分のポイントがYポイント減ります。ポイントが0になった時失格となります。",
    win_point: 15, // 初期値
    win_through: 3,
    correct_me: 0,
    wrong_me: -2,
    correct_other: -1,
    wrong_other: 0,
  },
  squarex: {
    name: "SquareX",
    description:
      "奇数問目と偶数問目の正解数をかけた数がX以上になれば勝ち抜けの形式です。",
    win_point: 16,
  },
  z: {
    name: "Z",
    description:
      "各プレイヤーはステージ1に立った状態でゲームを開始します。\nいずれかのプレイヤーがステージをクリアしたとき、全員の正解数と誤答数および失格状態をリセットし、ステージをクリアしたプレイヤーはステージを1進めます。\n各ステージの内容は次の通りです:\n・ステージ1:1回の正解でクリアです。誤答すると1問の間、解答権が剥奪されます\n・ステージ2:2回の正解でクリアです。1問の誤答で失格となります\n・ステージ3:3回の正解でクリアです。2間の誤答で失格となります\n・ステージ4:4回の正解でクリアです。3問の誤答で失格となります\nステージ5に到達すれば勝ち抜けです。既定の人数が勝ち抜けたときゲームを終了します。",
  },
  freezex: {
    name: "freezeX",
    description: "X問正解で勝ち抜け、N回目の誤答でN回休みの形式です。",
    win_point: 7,
  },
  "various-fluctuations": {
    name: "Various Fluctuations",
    description:
      "各プレイヤーは最初に好きな変動値Nを設定することができ、正解で+N、誤答で-N*(N-2)されます。",
    win_point: 30,
  },
};

export const GetRuleStringByType = (game: GameDBProps): string => {
  switch (game.rule) {
    case "normal":
      return "カウンター";
    case "nomx":
      return `${game.win_point}o${game.lose_point}x`;
    case "nbyn":
      return `${game.win_point}by${game.win_point}`;
    case "nupdown":
      return `${game.win_point}updown`;
    case "swedishx":
      return `Swedish${game.win_point}`;
    case "attacksurvival":
      return "アタックサバイバル";
    case "squarex":
      return `Square${game.win_point}`;
    case "z":
      return "Z";
    case "freezex":
      return `freez${game.win_point}`;
    case "various-fluctuations":
      return `Various Fluctuations`;
    default:
      return "unknown";
  }
};
