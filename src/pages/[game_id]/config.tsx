import { NextPage } from "next";
import router from "next/router";
import { useState } from "react";

import {
  Container,
  Alert,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Select,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Checkbox,
  UnorderedList,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import LinkButton from "#/blocks/LinkButton";
import ConfigInput from "#/components/ConfigInput";
import ConfigNumberInput from "#/components/ConfigNumberInput";
import Header from "#/components/Header";
import PlayerConfigInput from "#/components/PlayerConfigInput";
import db from "#/utils/db";

const Config: NextPage = () => {
  const { game_id } = router.query;
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(() => db.players.toArray(), []);
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));

  if (!game || !players || !logs) {
    return null;
  }
  const deleteGame = () => {
    db.games.delete(Number(game.id)).then(() => router.push("/"));
  };
  return (
    <Container maxW={1000} p={5}>
      <Header />
      {logs.length !== 0 && (
        <Alert status="error">
          ゲームは開始済みです。設定の変更はできません。
        </Alert>
      )}
      <Box>
        <H2>形式設定</H2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <ConfigInput
            input_id="name"
            label="ラウンド名"
            placehodler="〇〇大会"
          />
          {["nomx"].includes(game.rule) && (
            <>
              <ConfigNumberInput
                input_id="win_point"
                label="勝ち抜け正解数"
                max={30}
              />
              <ConfigNumberInput
                input_id="lose_point"
                label="失格誤答数"
                max={30}
              />
            </>
          )}
          {["nbyn", "nupdown", "swedishx"].includes(game.rule) && (
            <ConfigNumberInput input_id="win_point" label="N" max={10} />
          )}
          {["nupdown"].includes(game.rule) && (
            <ConfigNumberInput input_id="lose_point" label="失格誤答数" />
          )}
          {["attacksurvival"].includes(game.rule) && (
            <>
              <ConfigNumberInput input_id="win_point" label="初期値" max={30} />
              <ConfigNumberInput
                input_id="win_through"
                label="勝ち抜け人数"
                max={game.players.length}
              />
              <ConfigNumberInput
                input_id="correct_me"
                label="自分が正答"
                min={-10}
              />
              <ConfigNumberInput
                input_id="wrong_me"
                label="自分が誤答"
                min={-10}
              />
              <ConfigNumberInput
                input_id="correct_other"
                label="他人が正答"
                min={-10}
              />
              <ConfigNumberInput
                input_id="wrong_other"
                label="他人が誤答"
                min={-10}
              />
            </>
          )}
          {["squarex"].includes(game.rule) && (
            <ConfigNumberInput input_id="win_point" label="X" max={100} />
          )}
        </div>

        <H2>プレイヤー設定</H2>
        <Button
          onClick={() => setDrawerOpen(true)}
          size="sm"
          colorScheme="green"
        >
          選択する
        </Button>
        <Drawer
          isOpen={drawerOpen}
          placement="right"
          onClose={() => setDrawerOpen(false)}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>プレイヤー選択</DrawerHeader>
            <DrawerBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th>プレイヤー名</Th>
                      <Th>所属</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {players.map((player, i) => (
                      <Tr key={i}>
                        <Td>
                          <Checkbox
                            onChange={async (e) => {
                              if (game.players.includes(Number(player.id))) {
                                await db.games.update(Number(game.id), {
                                  players: game.players.filter(
                                    (player_id) => player_id != player.id
                                  ),
                                });
                              } else {
                                await db.games.update(Number(game.id), {
                                  players: [...game.players, Number(player.id)],
                                });
                              }
                            }}
                            isChecked={game.players.includes(Number(player.id))}
                          />
                        </Td>
                        <Td>{player.name}</Td>
                        <Td>{player.belong}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <UnorderedList>
          {game.players.map((player_id) => (
            <ListItem key={player_id}>
              {players.find((player) => player.id === player_id)?.name}
            </ListItem>
          ))}
        </UnorderedList>

        <H2>問題設定</H2>
        {quizes ? (
          <FormControl pt={5} width={200}>
            <FormLabel>セット名</FormLabel>
            <Select
              onChange={(v) => {
                db.games.update(Number(game_id), {
                  quizset_name: v,
                });
              }}
            >
              {quizsetList.map((setName) => (
                <option key={setName} value={setName}>
                  {setName}
                </option>
              ))}
            </Select>
          </FormControl>
        ) : (
          <div>データベースが見つかりません。</div>
        )}

        <Box sx={{ textAlign: "right", pt: 5 }}>
          <ButtonGroup spacing={5}>
            <Button colorScheme="red" onClick={deleteGame}>
              ゲームを削除
            </Button>
            <LinkButton href={`/${game_id}/board`}>ゲーム開始</LinkButton>
          </ButtonGroup>
        </Box>
      </Box>
    </Container>
  );
};

export default Config;
