import { useEffect, useState } from "react";
import { Link as ReactLink, useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { PlayerPlay, Trash } from "tabler-icons-react";

import InputLayout from "#/components/common/InputLayout";
import ConfigInput from "#/components/config/ConfigInput";
import ConfigLimit from "#/components/config/ConfigLimit";
import ConfigNumberInput from "#/components/config/ConfigNumberInput";
import CopyGame from "#/components/config/CopyGame";
import SelectPlayer from "#/components/config/SelectPlayer";
import SelectQuizset from "#/components/config/SelectQuizSet";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";
import { rules } from "#/utils/rules";

const ConfigPage = () => {
  const navigate = useNavigate();
  const isDesktop = useDeviceWidth();
  const { game_id } = useParams();
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const players = useLiveQuery(() => db.players.orderBy("name").toArray(), []);
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: game_id as string }).toArray(),
    []
  );
  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setTabIndex(0);
    db.games.update(game_id as string, { last_open: cdate().text() });
    document.title = "ゲーム設定 | Score Watcher";
  }, []);

  if (!game || !players || !logs) return null;

  const deleteGame = async () => {
    await db.games.delete(game.id);
    navigate("/");
  };

  const disabled = logs.length !== 0;

  return (
    <Container pt={5}>
      <Card my={3} p={2} variant="filled">
        <h3>{rules[game.rule].name}</h3>
        <div>
          {rules[game.rule].description.split("\n").map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Card>
      <InputLayout
        label={
          game.players.length === 0
            ? "「プレイヤー設定」からプレイヤーを選択してください。"
            : ""
        }
        simple
      >
        <Button
          as={ReactLink}
          colorScheme="green"
          isDisabled={game.players.length === 0}
          leftIcon={<PlayerPlay />}
          size="lg"
          to={`/${game_id}/board`}
        >
          ゲーム開始
        </Button>
      </InputLayout>
      <Box pt={10}>
        <Tabs
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
          orientation="vertical"
          position="relative"
          sx={{
            flexDirection: isDesktop ? "row" : "column",
            alignItems: "flex-start",
          }}
          variant="unstyled"
        >
          <TabList
            sx={{
              w: isDesktop ? "30%" : "100%",
              borderRadius: "0.5rem",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "gray.700",
              button: {
                justifyContent: "flex-start",
              },
              "button:nth-child(1)": {
                borderRadius: "0.5rem 0.5rem 0 0",
              },
              "button:nth-last-child(1)": {
                borderRadius: "0 0 0.5rem 0.5rem",
              },
              "button:hover": {
                bgColor: "gray.700",
              },
              "button[aria-selected='true']": {
                bgColor: "green.500",
                color: "black",
              },
            }}
          >
            <Tab>形式設定</Tab>
            <Tab>プレイヤー設定</Tab>
            <Tab>その他の設定</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <h2>形式設定</h2>
              <ConfigInput
                input_id="name"
                label="ゲーム名"
                placehodler="〇〇大会"
              />
              {game.rule !== "normal" && (
                <ConfigLimit
                  game_id={game_id!}
                  limit={game.limit}
                  win_through={game.win_through}
                />
              )}
              <Grid
                sx={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                {["nomx", "nomx-ad", "nomr"].includes(game.rule) && (
                  <ConfigNumberInput
                    disabled={disabled}
                    input_id="win_point"
                    label="勝ち抜け正解数"
                    max={1000}
                  />
                )}
                {["ny", "variables"].includes(game.rule) && (
                  <ConfigNumberInput
                    disabled={disabled}
                    input_id="win_point"
                    label="勝ち抜けポイント"
                    max={1000}
                    min={3}
                  />
                )}
                {["nbyn", "nupdown"].includes(game.rule) && (
                  <ConfigNumberInput
                    disabled={disabled}
                    input_id="win_point"
                    label="N"
                    max={10}
                  />
                )}
                {["squarex", "freezex"].includes(game.rule) && (
                  <ConfigNumberInput
                    disabled={disabled}
                    input_id="win_point"
                    label="X"
                    max={100}
                  />
                )}
                {["nomx", "nomx-ad", "nbyn", "nupdown", "nomr"].includes(
                  game.rule
                ) && (
                  <ConfigNumberInput
                    disabled={disabled}
                    input_id="lose_point"
                    label={game.rule === "nomr" ? "休み(M)" : "失格誤答数"}
                    max={100}
                  />
                )}
                {["attacksurvival"].includes(game.rule) && (
                  <>
                    <ConfigNumberInput
                      disabled={disabled}
                      input_id="win_point"
                      label="初期値"
                      max={30}
                    />
                    <ConfigNumberInput
                      disabled={disabled}
                      input_id="win_through"
                      label="勝ち抜け人数"
                      max={game.players.length}
                    />
                    <ConfigNumberInput
                      disabled={disabled}
                      input_id="correct_me"
                      label="自分が正答"
                      min={-10}
                    />
                    <ConfigNumberInput
                      disabled={disabled}
                      input_id="wrong_me"
                      label="自分が誤答"
                      min={-10}
                    />
                    <ConfigNumberInput
                      disabled={disabled}
                      input_id="correct_other"
                      label="他人が正答"
                      min={-10}
                    />
                    <ConfigNumberInput
                      disabled={disabled}
                      input_id="wrong_other"
                      label="他人が誤答"
                      min={-10}
                    />
                  </>
                )}
              </Grid>
            </TabPanel>
            <TabPanel>
              <SelectPlayer
                disabled={disabled}
                game_id={game.id}
                playerList={players}
                players={game.players}
                rule_name={game.rule}
              />
            </TabPanel>
            <TabPanel>
              <h2>その他の設定</h2>
              <VStack align="stretch" gap={5} pt={5}>
                <SelectQuizset
                  game_id={game.id}
                  game_quiz={game.quiz}
                  quizset_names={quizsetList}
                />
                <VStack align="stretch" gap={0}>
                  <h3>ゲーム</h3>
                  <InputLayout
                    helperText={
                      <>
                        プレイヤーの勝ち抜け時にDiscordへメッセージを送信します。詳しくは
                        <Link
                          as={ReactLink}
                          color="blue.500"
                          to={`/option/webhook?from=${game.id}`}
                        >
                          webhookについて
                        </Link>
                        を御覧ください。
                      </>
                    }
                    label="Discord Webhook"
                  >
                    <ConfigInput
                      input_id="discord_webhook_url"
                      placehodler="https://discord.com/api/webhooks/..."
                    />
                  </InputLayout>
                  <InputLayout label="ゲームのコピーを作成">
                    <CopyGame game={game} />
                  </InputLayout>
                  <InputLayout label="ゲームを削除">
                    <Button
                      colorScheme="red"
                      leftIcon={<Trash />}
                      onClick={deleteGame}
                    >
                      削除する
                    </Button>
                  </InputLayout>
                </VStack>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default ConfigPage;
