import { Link as ReactLink } from "react-router-dom";
import { useState } from "react";

import {
  Box,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
  Flex,
  Button,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import {
  AdjustmentsHorizontal,
  Chalkboard,
  Copy,
  DotsCircleHorizontal,
  Trash,
} from "tabler-icons-react";

import { createGame } from "#/utils/commonFunctions";
import db from "#/utils/db";
import { getRuleStringByType } from "#/utils/rules";

const GameList: React.FC = () => {
  const games = useLiveQuery(
    () => db.games.orderBy("last_open").reverse().toArray(),
    []
  );
  const logs = useLiveQuery(() => db.logs.toArray(), []);
  const [orderType, setOrderType] = useState<"last_open" | "name">("last_open");

  if (!games || games.length === 0) return null;

  return (
    <Box pt={5}>
      <h2>作成したゲーム</h2>
      <Flex sx={{ pb: 3, justifyContent: "flex-end" }}>
        <Select
          defaultValue={orderType}
          onChange={(v) => setOrderType(v.target.value as "last_open" | "name")}
          width={200}
        >
          <option value="last_open">最終閲覧順</option>
          <option value="name">ラウンド名順</option>
        </Select>
      </Flex>
      <TableContainer pt={5}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>ラウンド名</Th>
              <Th>形式</Th>
              <Th>人数</Th>
              <Th>進行状況</Th>
              <Th>最終閲覧</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {games
              .sort((prev, cur) => {
                if (orderType === "last_open") {
                  if (prev.last_open > cur.last_open) return -1;
                  if (prev.last_open < cur.last_open) return 1;
                  return 0;
                } else {
                  if (prev.name < cur.name) return -1;
                  if (prev.name > cur.name) return 1;
                  return 0;
                }
              })
              .map((game) => {
                const eachGameLogs = (logs || []).filter(
                  (log) => log.game_id === game.id
                );
                const gameState =
                  eachGameLogs.length === 0
                    ? "設定中"
                    : `${eachGameLogs.length}問目`;
                return (
                  <Tr key={game.id}>
                    <Td>{game.name}</Td>
                    <Td>{getRuleStringByType(game)}</Td>
                    <Td>{game.players.length}</Td>
                    <Td>{gameState}</Td>
                    <Td>{cdate(game.last_open).format("MM/DD HH:mm")}</Td>
                    <Td sx={{ textAlign: "right" }}>
                      <HStack sx={{ justifyContent: "flex-end" }}>
                        <ReactLink to={`/${game.id}/config`}>
                          <Button
                            size="sm"
                            colorScheme="green"
                            variant="ghost"
                            leftIcon={<AdjustmentsHorizontal />}
                          >
                            開く
                          </Button>
                        </ReactLink>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<DotsCircleHorizontal />}
                            size="sm"
                            variant="ghost"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<Copy />}
                              onClick={() =>
                                createGame(
                                  game.rule,
                                  game,
                                  `${game.name}のコピー`,
                                  "copy"
                                )
                              }
                            >
                              コピーを作成
                            </MenuItem>
                            {game.players.length !== 0 && (
                              <ReactLink to={`/${game.id}/board`}>
                                <MenuItem icon={<Chalkboard />}>
                                  得点画面を開く
                                </MenuItem>
                              </ReactLink>
                            )}
                            <MenuItem
                              icon={<Trash />}
                              color="red.500"
                              onClick={async () =>
                                await db.games.delete(game.id)
                              }
                            >
                              ゲームを削除
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GameList;
