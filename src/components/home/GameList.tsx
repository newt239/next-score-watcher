import NextLink from "next/link";

import {
  Box,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { AdjustmentsHorizontal } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import LinkButton from "#/blocks/LinkButton";
import db from "#/utils/db";
import { GetRuleStringByType, rules } from "#/utils/rules";

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
                      {game.name}
                    </NextLink>
                  ) : (
                    game.name
                  )}
                </Td>
                <Td>{GetRuleStringByType(game)}</Td>
                <Td>{game.players.length}</Td>
                <Td sx={{ textAlign: "right" }}>
                  <LinkButton
                    icon={<AdjustmentsHorizontal />}
                    size="sm"
                    href={`/${game.id}/config`}
                  >
                    設定
                  </LinkButton>
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
