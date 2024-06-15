"use client";

import { useRouter } from "next/navigation";

import { Accordion, Box, Button, Flex, List, Tabs, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useLiveQuery } from "dexie-react-hooks";
import { PlayerPlay, Trash } from "tabler-icons-react";

import ConfigInput from "./_components/ConfigInput";
import CopyGame from "./_components/CopyGame";
import ExportGame from "./_components/ExportGame";
import PlayersConfig from "./_components/PlayersConfig";
import RuleSettings from "./_components/RuleSettings";
import SelectQuizset from "./_components/SelectQuizset";

import NotFound from "@/app/(default)/_components/NotFound";
import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";
import db from "@/utils/db";
import { rules } from "@/utils/rules";

export default function ConfigPage({
  params,
}: {
  params: { game_id: string };
}) {
  const router = useRouter();
  const game = useLiveQuery(() => db().games.get(params.game_id as string));
  const players = useLiveQuery(
    () => db().players.orderBy("name").toArray(),
    []
  );
  const logs = useLiveQuery(
    () =>
      db()
        .logs.where({ game_id: params.game_id as string })
        .toArray(),
    []
  );
  const quizes = useLiveQuery(() => db().quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));

  if (!game || !players || !logs) return <NotFound />;

  const deleteGame = async () => {
    await db().games.delete(game.id);
    notifications.show({
      title: "ゲームを削除しました",
      message: `${game.name}(${rules[game.rule].name})を削除しました`,
      autoClose: 9000,
      withCloseButton: true,
    });
    router.refresh();
  };

  const showDeleteGameConfirm = () => {
    modals.openConfirmModal({
      title: "ゲームを削除",
      centered: true,
      children: (
        <Box>
          <p>ゲーム「{game.name}」を削除します。</p>
          <p>この操作は取り消せません。</p>
        </Box>
      ),
      labels: { confirm: "削除する", cancel: "削除しない" },
      confirmProps: { color: "red" },
      onConfirm: deleteGame,
    });
  };

  const disabled = logs.length !== 0;

  const errorMessages = [];
  if (game.players.length === 0)
    errorMessages.push("「プレイヤー設定」からプレイヤーを選択してください。");
  if (game.players.length > 14)
    errorMessages.push("プレイヤー人数は14人以内で設定してください。");
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
    <>
      <h2>{rules[game.rule].name}</h2>
      <Accordion variant="separated">
        <Accordion.Item value="rule_description">
          <Accordion.Control>
            {rules[game.rule].short_description}
          </Accordion.Control>
          <Accordion.Panel pb={4}>
            <p>{rules[game.rule]?.description}</p>
            <p>
              より詳細な説明は
              <Link href={`https://docs.score-watcher.com/rules/${game.rule}`}>
                ヘルプサイト
              </Link>
              をご覧ください。
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Box
        className="my-5 rounded-md border border-solid"
        style={{
          borderColor: playButtonIsDisabled
            ? "red.5!important"
            : "white!important",
          _dark: {
            borderColor: playButtonIsDisabled
              ? "red.3!important"
              : "gray.8!important",
          },
        }}
      >
        <Flex className="items-center justify-between p-4">
          <List className="text-red-500">
            {errorMessages.map((m) => (
              <List.Item key={m}>{m}</List.Item>
            ))}
          </List>
          {playButtonIsDisabled ? (
            <Button
              disabled={playButtonIsDisabled}
              leftSection={<PlayerPlay />}
              size="md"
            >
              ゲーム開始
            </Button>
          ) : (
            <ButtonLink
              size="md"
              variant="gradient"
              gradient={{ from: "teal", to: "lime", deg: 135 }}
              href={`/games/${params.game_id}/board`}
              leftSection={<PlayerPlay />}
            >
              ゲーム開始
            </ButtonLink>
          )}
        </Flex>
      </Box>
      <Box>
        <Tabs variant="outline" orientation="horizontal" defaultValue="rule">
          <Tabs.List grow>
            <Tabs.Tab size="1.5rem" value="rule">
              形式設定
            </Tabs.Tab>
            <Tabs.Tab value="player">プレイヤー設定</Tabs.Tab>
            <Tabs.Tab value="other">その他の設定</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="rule">
            <RuleSettings disabled={disabled} game={game} />
          </Tabs.Panel>
          <Tabs.Panel value="player">
            <PlayersConfig
              disabled={disabled}
              game_id={game.id}
              playerList={players}
              players={game.players}
              rule_name={game.rule}
            />
          </Tabs.Panel>
          <Tabs.Panel value="other">
            <SelectQuizset
              game_id={game.id}
              game_quiz={game.quiz}
              quizset_names={quizsetList}
            />
            <h3>オプション</h3>
            <ConfigInput
              label="Discord Webhook"
              input_id="discord_webhook_url"
              placeholder="https://discord.com/api/webhooks/..."
              type="url"
            />
            <h3>ゲーム</h3>
            <CopyGame game={game} />
            <Title order={4}>エクスポート</Title>
            <ExportGame game={game} />
            <Title order={4}>ゲームを削除</Title>
            <Button
              color="red"
              leftSection={<Trash />}
              onClick={showDeleteGameConfirm}
            >
              削除する
            </Button>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </>
  );
}
