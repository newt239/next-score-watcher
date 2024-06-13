"use client";

import { useEffect, useState } from "react";

import { Box, Card, Title } from "@mantine/core";
import { ReactSortable } from "react-sortablejs";

import IndividualConfig from "./IndivisualConfig";
import SelectPlayerDrawer from "./SelectPlayerDrawer";

import db from "@/utils/db";
import { GameDBPlayerProps, PlayerDBProps, RuleNames } from "@/utils/types";

type Props = {
  game_id: string;
  rule_name: RuleNames;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  disabled?: boolean;
};

const PlayersConfig: React.FC<Props> = ({
  game_id,
  rule_name,
  playerList,
  players,
  disabled,
}) => {
  const [sortableList, setSortableList] = useState(players);

  useEffect(() => {
    if (players.length !== sortableList.length) {
      setSortableList(players);
    }
  }, [players]);

  return (
    <>
      <Title order={2}>プレイヤー設定</Title>
      <Title order={3}>プレイヤー選択</Title>
      <SelectPlayerDrawer
        disabled={disabled}
        game_id={game_id}
        playerList={playerList}
        players={players}
      />
      {players.length !== 0 && (
        <>
          <h3>並び替え</h3>
          <Box className="mt-3 bg-gray-300 p-3 dark:bg-gray-600">
            <ReactSortable
              animation={200}
              delay={2}
              direction="vertical"
              list={sortableList}
              setList={(newState) => {
                (async () => {
                  if (newState.length === players.length) {
                    for (let i = 0; i < players.length; i++) {
                      // 並び替えが行われたときのみ1回だけ処理する
                      // 選択プレイヤーの変更と個人の初期値設定の変更のケースを除外
                      if (players[i].id !== newState[i].id) {
                        await db().games.update(game_id, {
                          players: newState,
                        });
                        setSortableList(newState);
                        break;
                      }
                    }
                  }
                })();
              }}
              className="flex flex-row gap-5 lg:flex-col"
            >
              {sortableList.map((player, index) => (
                <Card key={player.id} className="bg-gray-200 dark:bg-gray-700">
                  <Box className="flex h-full flex-row items-center justify-between gap-3 lg:flex-col">
                    <Box
                      className="whitespace-nowrap "
                      style={{
                        writingMode: "vertical-rl",
                        textOrientation: "upright",
                      }}
                    >
                      <p>{player.name}</p>
                    </Box>
                    <IndividualConfig
                      correct={[
                        "normal",
                        "nomx",
                        "nomx-ad",
                        "ny",
                        "nomr",
                        "nbyn",
                        "nupdown",
                        "swedish10",
                        "backstream",
                        "variables",
                        "attacksurvival",
                      ].includes(rule_name)}
                      disabled={disabled}
                      index={index}
                      wrong={[
                        "nomx",
                        "nomx-ad",
                        "ny",
                        "nomr",
                        "nbyn",
                        "nupdown",
                        "swedish10",
                        "backstream",
                      ].includes(rule_name)}
                    />
                  </Box>
                </Card>
              ))}
            </ReactSortable>
          </Box>
          <p>
            ※個人設定が行える形式では、個人の初期値を変更した場合、1問目の時点での勝ち抜けリーチや失格リーチが正しく表示されないことがあります。
          </p>
        </> // 上記はgetInitialPlayersStateでstateとreach_stateを共通でplayingにしていることによるもの
      )}
    </>
  );
};

export default PlayersConfig;
