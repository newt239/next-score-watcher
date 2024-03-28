import { useEffect, useState } from "react";

import { Card, CardBody, ListItem, UnorderedList } from "@chakra-ui/react";
import { ReactSortable } from "react-sortablejs";

import SelectPlayerDrawer from "./SelectPlayerDrawer";

import IndividualConfig from "#/features/config/IndividualConfig";
import useDeviceWidth from "#/features/hooks/useDeviceWidth";
import db from "#/utils/db";
import { GameDBPlayerProps, PlayerDBProps, RuleNames } from "#/utils/types";
import { css } from "@panda/css";

type SelectPlayerProps = {
  game_id: string;
  rule_name: RuleNames;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  disabled?: boolean;
};

const PlayersConfig: React.FC<SelectPlayerProps> = ({
  game_id,
  rule_name,
  playerList,
  players,
  disabled,
}) => {
  const isDesktop = useDeviceWidth();
  const [sortableList, setSortableList] = useState(players);

  useEffect(() => {
    if (players.length !== sortableList.length) {
      setSortableList(players);
    }
  }, [players]);

  return (
    <div>
      <h2>プレイヤー設定</h2>
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
        <h3>{isDesktop ? "個人設定" : "並び替え"}</h3>
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
                direction={isDesktop ? "vertical" : "horizontal"}
                list={sortableList}
                setList={(newState) => {
                  (async () => {
                    if (newState.length === players.length) {
                      for (let i = 0; i < players.length; i++) {
                        // 並び替えが行われたときのみ1回だけ処理する
                        // 選択プレイヤーの変更と個人の初期値設定の変更のケースを除外
                        if (players[i].id !== newState[i].id) {
                          await db.games.update(game_id, {
                            players: newState,
                          });
                          setSortableList(newState);
                          break;
                        }
                      }
                    }
                  })();
                }}
                style={{
                  display: "flex",
                  flexDirection: isDesktop ? "row" : "column",
                  gap: 5,
                }}
              >
                {sortableList.map((player, index) => (
                  <Card
                    className={css({
                      bgColor: "gray.200",
                      _dark: {
                        bgColor: "gray.700",
                      },
                    })}
                    cursor="grab"
                    key={player.id}
                  >
                    <CardBody>
                      <div
                        className={css({
                          flexDirection: isDesktop ? "column" : "row",
                          gap: 3,
                          justifyContent: "space-between",
                          alignItems: "center",
                          height: "100%",
                        })}
                      >
                        <div
                          className={css({
                            writingMode: isDesktop
                              ? "vertical-rl"
                              : "horizontal-tb",
                            whiteSpace: "nowrap",
                            textOrientation: "upright",
                          })}
                        >
                          <p>{player.name}</p>
                        </div>
                        {isDesktop && (
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
                        )}
                      </div>
                    </CardBody>
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
      {!isDesktop && (
        <div>
          <h3>個人設定</h3>
          <UnorderedList>
            {sortableList.map((player, index) => (
              <ListItem key={player.id} lineHeight="3rem">
                <span>{player.name}</span>
                <IndividualConfig
                  correct={[
                    "normal",
                    "nomx",
                    "nomx-ad",
                    "ny",
                    "nomr",
                    "variables",
                    "attacksurvival",
                  ].includes(rule_name)}
                  disabled={disabled}
                  index={index}
                  wrong={["nomx", "nomx-ad", "ny", "nomr"].includes(rule_name)}
                />
              </ListItem>
            ))}
          </UnorderedList>
        </div>
      )}
    </div>
  );
};

export default PlayersConfig;
