"use client";

import { useEffect, useState } from "react";

import { Box, Card, CardBody, Flex, Text } from "@chakra-ui/react";
import { ReactSortable } from "react-sortablejs";

import SelectPlayerDrawer from "./SelectPlayerDrawer";

import IndividualConfig from "#/app/(default)/games/[game_id]/config/_components/IndividualConfig";
import { GamePlayersDB, PlayersDB, RuleNames } from "#/utils/types";

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
    <Box>
      <h2>プレイヤー設定</h2>
      <Box pt={5}>
        <h3>プレイヤー選択</h3>
        <SelectPlayerDrawer
          disabled={disabled}
          game_id={game_id}
          playerList={playerList}
          players={players}
        />
      </Box>
      <Box pt={5}>
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
                      <Flex
                        sx={{
                          flexDirection: "row",
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
                          }}
                        >
                          <Text size="xl">{player.name}</Text>
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
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </ReactSortable>
            </Box>
            <Text pt={2}>
              ※個人設定が行える形式では、個人の初期値を変更した場合、1問目の時点での勝ち抜けリーチや失格リーチが正しく表示されないことがあります。
            </Text>
          </> // 上記はgetInitialPlayersStateでstateとreach_stateを共通でplayingにしていることによるもの
        ) : (
          <Box pt={3}>ここに選択されたプレイヤーが表示されます</Box>
        )}
      </Box>
    </Box>
  );
};

export default PlayersConfig;
