import { Link as ReactLink } from "react-router-dom";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  TableContainer,
  TagLabel,
  TagRightIcon,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  Table,
  Tag,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowBackUp, Layout, X } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import db from "#/utils/db";

const EachPlayerPage = () => {
  const { player_id } = useParams();
  const player = useLiveQuery(() => db.players.get(player_id as string));

  return (
    <>
      <Box>
        <ReactLink to={`/player`}>
          <Button
            colorScheme="green"
            variant="ghost"
            leftIcon={<ArrowBackUp />}
          >
            プレイヤー一覧に戻る
          </Button>
        </ReactLink>
      </Box>
      {!player ? (
        <Text>該当するプレイヤーが見つかりませんでした。</Text>
      ) : (
        <>
          <H2>{player.name}</H2>
          <TableContainer>
            <Table>
              <Tbody>
                <Tr>
                  <Th>ID</Th>
                  <Td isNumeric>{player.id}</Td>
                </Tr>
                <Tr>
                  <Th>サブテキスト</Th>
                  <Td isNumeric>{player.text}</Td>
                </Tr>
                <Tr>
                  <Th>所属</Th>
                  <Td isNumeric>{player.belong}</Td>
                </Tr>
                <Tr>
                  <Th>タグ</Th>
                  <Td isNumeric>
                    {player.tags.map((tag) => (
                      <Tag key={tag} colorScheme="green" size="sm">
                        <TagLabel>{tag}</TagLabel>
                        <TagRightIcon
                          sx={{ cursor: "pointer" }}
                          onClick={async () => {
                            await db.players.update(player.id, {
                              tags: player.tags.filter(
                                (playerTag) => playerTag !== tag
                              ),
                            });
                          }}
                        >
                          <X />
                        </TagRightIcon>
                      </Tag>
                    ))}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default EachPlayerPage;
