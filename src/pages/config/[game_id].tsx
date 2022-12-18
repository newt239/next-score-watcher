import { useEffect, useState } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import { useRouter } from "next/router";

import ConfigInput from "#/components/ConfigInput";
import ConfigNumberInput from "#/components/ConfigNumberInput";
import RuleCard, { RuleCardProps } from "#/components/RuleCard";
import db, { gameDBProps } from "#/utils/db";

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
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(
    () => db.players.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const updatePlayerCount = async () => {
    if (game) {
      const oldCount = await db.players.where({ game_id: game.id }).count();
      if (oldCount < game.count) {
        for (let i = oldCount + 1; i <= game.count; i++) {
          await db.players.put({
            game_id: Number(game.id),
            name: `プレイヤー${i}`,
            initial_correct: 0,
            initial_wrong: 0,
          });
        }
      }
    }
  };
  useEffect(() => {
    updatePlayerCount();
  }, [game]);
  if (!game) {
    return null;
  }
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
        {}
      </main>
    </div>
  );
};

export default Config;
