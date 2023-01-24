import NextLink from "next/link";
import router from "next/router";

import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  AdjustmentsHorizontal,
  Chalkboard,
  Copy,
  DotsCircleHorizontal,
  Trash,
} from "tabler-icons-react";

import H2 from "#/blocks/H2";
import LinkButton from "#/blocks/LinkButton";
import { createGame } from "#/utils/commonFunctions";
import db from "#/utils/db";
import { GetRuleStringByType } from "#/utils/rules";

const GameList: React.FC = () => {
  const games = useLiveQuery(() => db.games.toArray());

  if (!games || games.length === 0) return null;
  return (
    <Box pt={5}>
      <H2>作成したゲーム</H2>
      <TableContainer pt={5}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>ラウンド名</Th>
              <Th>形式</Th>
              <Th>人数</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {games.map((game) => (
              <Tr key={game.id}>
                <Td>
                  {game.players.length !== 0 ? (
                    <NextLink href={`/${game.id}/board`} passHref>
                      <Button variant="link">{game.name}</Button>
                    </NextLink>
                  ) : (
                    game.name
                  )}
                </Td>
                <Td>{GetRuleStringByType(game)}</Td>
                <Td>{game.players.length}</Td>
                <Td sx={{ textAlign: "right" }}>
                  <HStack sx={{ justifyContent: "flex-end" }}>
                    <LinkButton
                      icon={<AdjustmentsHorizontal />}
                      href={`/${game.id}/config`}
                      size="sm"
                      colorScheme="green"
                      variant="ghost"
                    >
                      開く
                    </LinkButton>
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
                          <MenuItem
                            icon={<Chalkboard />}
                            onClick={() => router.push(`/${game.id}/board`)}
                          >
                            得点画面を開く
                          </MenuItem>
                        )}
                        <MenuItem
                          icon={<Trash />}
                          color="red.500"
                          onClick={async () => await db.games.delete(game.id)}
                        >
                          ゲームを削除
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GameList;
