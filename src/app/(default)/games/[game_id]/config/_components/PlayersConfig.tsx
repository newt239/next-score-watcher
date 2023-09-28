"use client";

import { useEffect, useState } from "react";

import { ReactSortable } from "react-sortablejs";

import SelectPlayerDrawer from "./SelectPlayerDrawer";

import IndividualConfig from "#/app/(default)/games/[game_id]/config/_components/IndividualConfig";
import Card from "#/app/_components/Card";
import { GamePlayersDB, PlayersDB, RuleNames } from "#/utils/types";
import { css } from "@panda/css";

type SelectPlayerProps = {
  game_id: string;
  rule_name: RuleNames;
  playerList: GamePlayersDB["Insert"][];
  players: PlayersDB["Insert"][];
  disabled?: boolean;
};

const PlayersConfig: React.FC<SelectPlayerProps> = ({
  game_id,
  rule_name,
  playerList,
  players,
  disabled,
}) => {
  const [sortableList, setSortableList] = useState(players);

  useEffect(() => {
    setSortableList(players);
  }, [players]);

  return (
    <>
      <div>
        <h3>プレイヤー選択</h3>
        <SelectPlayerDrawer
          disabled={disabled}
          game_id={game_id}
          playerList={playerList}
          players={players}
        />
      </div>
      <div>
        <h3>並び替え</h3>
        {players.length !== 0 ? (
          <>
            <div
              className={css({
                mt: 3,
                p: 3,
                bgColor: "gray.300",
                _dark: {
                  bgColor: "gray.600",
                },
              })}
            >
              <ReactSortable
                animation={200}
                delay={2}
                direction="vertical"
                list={sortableList}
                setList={(newState) => {
                  setSortableList(newState);
                }}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                {sortableList.map((player, index) => (
                  <Card
                    key={player.id}
                    sx={{
                      cursor: "grab",
                      bgColor: "gray.200",
                      _dark: {
                        bgColor: "gray.700",
                      },
                    }}
                  >
                    <div
                      className={css({
                        display: "flex",
                        flexDirection: "row",
                        gap: 3,
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "100%",
                      })}
                    >
                      <div
                        className={css({
                          writingMode: "horizontal-tb",
                          whiteSpace: "nowrap",
                          textOrientation: "upright",
                        })}
                      >
                        <p>{player.name}</p>
                      </div>
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
                        game_id={game_id}
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
                    </div>
                  </Card>
                ))}
              </ReactSortable>
            </div>
            <p>
              ※個人設定が行える形式では、個人の初期値を変更した場合、1問目の時点での勝ち抜けリーチや失格リーチが正しく表示されないことがあります。
            </p>
          </> // 上記はgetInitialPlayersStateでstateとreach_stateを共通でplayingにしていることによるもの
        ) : (
          <div>ここに選択されたプレイヤーが表示されます</div>
        )}
      </div>
    </>
  );
};

export default PlayersConfig;
