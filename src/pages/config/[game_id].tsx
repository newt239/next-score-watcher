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
      const players = await db.players
        .where({ game_id: game.id })
        .reverse()
        .toArray();
      if (players.length < game.count) {
        for (let i = players.length + 1; i <= game.count; i++) {
          await db.players.put({
            game_id: Number(game.id),
            name: `プレイヤー${i}`,
            initial_correct: 0,
            initial_wrong: 0,
          });
        }
      } else {
        players.forEach((player, i) => {
          if (i < players.length - game.count) {
            db.players.delete(Number(player.id)).catch((e) => console.log(e));
          }
        });
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
            type: "game",
            input_id: "name",
            label: "ゲーム名",
            placehodler: "",
            required: true,
          }}
        />
        <ConfigNumberInput
          props={{
            type: "game",
            input_id: "count",
            label: "プレイヤー人数",
            min: 1,
            max: 5,
          }}
        />
        <h2>プレイヤー設定</h2>
        {players?.map((player, i) => (
          <div key={player.id}>
            <ConfigInput
              props={{
                type: "player",
                input_id: "name",
                id: Number(player.id),
                label: "プレイヤー名",
                placehodler: `プレイヤー${i}`,
                required: true,
              }}
            />
            <ConfigInput
              props={{
                type: "player",
                input_id: "belong",
                id: Number(player.id),
                label: "所属",
                placehodler: `〇〇高校`,
                required: true,
              }}
            />
          </div>
        ))}
      </main>
    </div>
  );
};

export default Config;
