"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  Container,
  ListItem,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { PlayerPlay, Trash } from "tabler-icons-react";

import ConfigInput from "#/app/(default)/games/[game_id]/config/_components/ConfigInput";
import ConfigTabList from "#/app/(default)/games/[game_id]/config/_components/ConfigTabList";
import CopyGame from "#/app/(default)/games/[game_id]/config/_components/CopyGame";
import RuleSettings from "#/app/(default)/games/[game_id]/config/_components/RuleSettings";
import PlayersConfig from "#/app/(default)/games/[game_id]/config/_components/SelectPlayer";
import SelectQuizset from "#/app/(default)/games/[game_id]/config/_components/SelectQuizSet";
import AlertDialog from "#/components/common/AlertDialog";
import InputLayout from "#/components/common/InputLayout";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import db from "#/utils/db";
import { recordEvent } from "#/utils/ga4";
import { rules } from "#/utils/rules";

export default function GameConfigPage({
  params,
}: {
  params: { game_id: string };
}) {
  const router = useRouter();
  const isDesktop = useDeviceWidth();
  const toast = useToast();
  const game = useLiveQuery(() => db.games.get(params.game_id as string));
  const players = useLiveQuery(() => db.players.orderBy("name").toArray(), []);
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: params.game_id as string }).toArray(),
    []
  );
  const quizes = useLiveQuery(() => db.quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));
  const [tabIndex, setTabIndex] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setTabIndex(0);
    db.games.update(params.game_id as string, { last_open: cdate().text() });
    document.title = "ゲーム設定 | Score Watcher";
  }, []);

  if (!game || !players || !logs) return null;

  const deleteGame = async () => {
    await db.games.delete(game.id);
    toast({
      title: "ゲームを削除しました",
      description: `${game.name}(${rules[game.rule].name})を削除しました`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
    recordEvent({
      action: "delete_game",
      category: "engagement",
      label: game.rule,
    });
    router.push("/");
  };

  const disabled = logs.length !== 0;

  const errorMessages = [];
  if (game.players.length === 0)
    errorMessages.push("「プレイヤー設定」からプレイヤーを選択してください。");
  if (game.win_through && game.players.length <= game.win_through)
    errorMessages.push(
      "「勝ち抜け人数」はプレイヤーの人数より少なくしてください。"
    );
  if (disabled)
    errorMessages.push(
      `現在${
        logs.length + 1
      }問目です。ゲームが開始済みであるため、一部の設定は変更できません。`
    );

  const playButtonIsDisabled =
    errorMessages.filter((t) => t.indexOf("ゲームが開始済み") === -1).length !==
    0;

  return (
    <Container pt={5}>
      <Card p={2} variant="filled">
        <h3>{rules[game.rule].name}</h3>
        <div>
          {rules[game.rule].description.split("\n").map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Card>
      <InputLayout
        label={
          <UnorderedList
            sx={{
              color: "red.500",
              _dark: {
                color: "red.300",
              },
            }}
          >
            {errorMessages.map((m) => (
              <ListItem key={m}>{m}</ListItem>
            ))}
          </UnorderedList>
        }
        simple
        vertical={!isDesktop}
        wrapperStyle={{
          my: 5,
          gap: 5,
          borderStyle: "solid",
          borderRadius: "md",
          borderWidth: 2,
          borderColor: playButtonIsDisabled ? "red.500" : "white",
          _dark: {
            borderColor: playButtonIsDisabled ? "red.300" : "gray.800",
          },
        }}
      >
        <Button
          as={Link}
          colorScheme="green"
          href={`/${params.game_id}/board`}
          isDisabled={playButtonIsDisabled}
          leftIcon={<PlayerPlay />}
          size="lg"
        >
          ゲーム開始
        </Button>
      </InputLayout>
      <Box>
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
              <PlayersConfig
                disabled={disabled}
                game_id={game.id}
                playerList={players}
                players={game.players}
                rule_name={game.rule}
              />
            </TabPanel>
            <TabPanel>
              <h2>その他の設定</h2>
              <VStack align="stretch" gap={0} pt={5}>
                <SelectQuizset
                  game_id={game.id}
                  game_quiz={game.quiz}
                  quizset_names={quizsetList}
                />
              </VStack>
              <VStack align="stretch" gap={0} pt={5}>
                <h3>オプション</h3>
                <ConfigInput
                  input_id="discord_webhook_url"
                  label="Discord Webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  type="url"
                />
              </VStack>
              <VStack align="stretch" gap={0} pt={5}>
                <h3>ゲーム</h3>
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}
