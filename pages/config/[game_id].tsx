import { NextPage } from "next";

import Input from "components/Input";
import RuleCard, { RuleCardProps } from "components/RuleCard";

const ruleList: RuleCardProps[] = [
  {
    id: "normal",
    name: "スコア計算",
    description: "単純なスコアを計算します。",
  },
];

const Config: NextPage = () => {
  return (
    <div>
      <main>
        <h2>形式設定</h2>
        <Input
          props={{
            id: "name",
            label: "ゲーム名",
            placehodler: "",
            required: true,
          }}
        />
        <h2>プレイヤー設定</h2>
      </main>
    </div>
  );
};

export default Config;
