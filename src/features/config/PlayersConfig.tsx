import { useEffect, useState } from "react";

import { Box, Card, CardBody } from "@chakra-ui/react";
import { ReactSortable } from "react-sortablejs";

import IndividualConfig from "~/features/config/IndividualConfig";
import useDeviceWidth from "~/hooks/useDeviceWidth";
import db from "~/utils/db";
import { GameDBPlayerProps, PlayerDBProps, RuleNames } from "~/utils/types";
import SelectPlayerDrawer from "./SelectPlayerDrawer";

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
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const isDesktop = useDeviceWidth();
  const [sortableList, setSortableList] = useState(players);

  useEffect(() => {
    if (players.length !== sortableList.length) {
      setSortableList(players);
    }
  }, [players]);

  return (
    <>
      <h2>プレイヤー設定</h2>
      <Box>
        <h3>プレイヤー選択</h3>
        <SelectPlayerDrawer
          disabled={disabled}
          game_id={game_id}
          playerList={playerList}
          players={players}
        />
      </Box>
      <Box>
        <h3>並び替え</h3>
        {players.length !== 0 ? (
          <>
            <Box
              sx={{
                mt: 3,
                p: 3,
                bgColor: "gray.300",
                _dark: {
                  bgColor: "gray.600",
                },
              }}
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
                          await db(currentProfile).games.update(game_id, {
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
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {sortableList.map((player, index) => (
                  <Card
                    cursor="grab"
                    key={player.id}
                    sx={{
                      bgColor: "gray.200",
                      _dark: {
                        bgColor: "gray.700",
                      },
                    }}
                  >
                    <CardBody>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isDesktop ? "column" : "row",
                          gap: 3,
                          justifyContent: "space-between",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            writingMode: "horizontal-tb",
                            whiteSpace: "nowrap",
                            textOrientation: "upright",
                            lg: {
                              writingMode: "vertical-rl",
                            },
                          }}
                        >
                          <p>{player.name}</p>
                        </Box>
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
                      </Box>
                    </CardBody>
                  </Card>
                ))}
              </ReactSortable>
            </Box>
            <p>
              ※個人設定が行える形式では、個人の初期値を変更した場合、1問目の時点での勝ち抜けリーチや失格リーチが正しく表示されないことがあります。
            </p>
          </> // 上記はgetInitialPlayersStateでstateとreach_stateを共通でplayingにしていることによるもの
        ) : (
          <Box>ここに選択されたプレイヤーが表示されます</Box>
        )}
      </Box>
      <Box
        sx={{
          display: "block",
          lg: {
            display: "none",
          },
        }}
      >
        <h3>個人設定</h3>
        <ul>
          {sortableList.map((player, index) => (
            <li key={player.id}>
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
            </li>
          ))}
        </ul>
      </Box>
    </>
  );
};

export default PlayersConfig;
