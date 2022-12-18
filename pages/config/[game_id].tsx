import { useEffect } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import { useRouter } from "next/router";

import Input from "components/Input";
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
