import { useEffect, useState } from "react";
import { Link as ReactLink, useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Container,
  Link,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { PlayerPlay, Trash } from "tabler-icons-react";

import AlertDialog from "#/components/common/AlertDialog";
import InputLayout from "#/components/common/InputLayout";
import ConfigInput from "#/components/config/ConfigInput";
import ConfigTabList from "#/components/config/ConfigTabList";
import CopyGame from "#/components/config/CopyGame";
import RuleSettings from "#/components/config/RuleSettings";
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

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          disabled
            ? `現在${
                logs.length + 1
              }問目です。ゲームが開始済みであるため、一部の設定は変更できません。`
            : game.players.length === 0
            ? "「プレイヤー設定」からプレイヤーを選択してください。"
            : ""
        }
        simple
        vertical={!isDesktop}
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
          <ConfigTabList />
          <TabPanels>
            <TabPanel>
              <h2>形式設定</h2>
              <RuleSettings disabled={disabled} game={game} />
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
                      onClick={onOpen}
                    >
                      削除する
                    </Button>
                  </InputLayout>
                  <AlertDialog
                    body="ゲームを削除します。この操作は取り消せません。"
                    isOpen={isOpen}
                    onClose={onClose}
                    onConfirm={() => {
                      deleteGame();
                      onClose();
                    }}
                    title="ゲームを削除"
                  />
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
