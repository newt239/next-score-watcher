import { NextPage } from "next";
import { useRouter } from "next/router";

import ConfigInput from "components/ConfigInput";
import ConfigNumberInput from "components/ConfigNumberInput";
import RuleCard, { RuleCardProps } from "components/RuleCard";
import db from "utils/db";

const ruleList: RuleCardProps[] = [
  {
    id: "normal",
    name: "スコア計算",
    description: "単純なスコアを計算します。",
  },
];

const Config: NextPage = () => {
  const router = useRouter();
  const { game_id } = router.query;
  db.games.get(Number(game_id)).then((game) => {
    if (!game) {
      router.push("/");
    }
  });

  return (
    <div>
      <main>
        <h2>形式設定</h2>
        <ConfigInput
          props={{
            id: "name",
            label: "ゲーム名",
            placehodler: "",
            required: true,
          }}
        />
        <ConfigNumberInput
          props={{
            id: "count",
            label: "プレイヤー人数",
            min: 1,
            max: 5,
          }}
        />
        <h2>プレイヤー設定</h2>
      </main>
    </div>
  );
};

export default Config;
