"use client";

import { useRouter } from "next/navigation";

import { useLiveQuery } from "dexie-react-hooks";
import { Link, PlayerPlay, Trash } from "tabler-icons-react";

import NotFound from "@/app/(default)/_components/NotFound";
import ButtonLink from "@/components/ButtonLink";
import db from "@/utils/db";
import { rules } from "@/utils/rules";
import { Accordion, Box, Button, Flex, List, Tabs, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import ConfigInput from "./_components/ConfigInput";
import CopyGame from "./_components/CopyGame";
import ExportGame from "./_components/ExportGame";
import PlayersConfig from "./_components/PlayersConfig";
import RuleSettings from "./_components/RuleSettings";
import SelectQuizset from "./_components/SelectQuizset";

export default function ConfigPage({
  params,
}: {
  params: { game_id: string };
}) {
  const router = useRouter();
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(params.game_id as string)
  );
  const players = useLiveQuery(
    () => db(currentProfile).players.orderBy("name").toArray(),
    []
  );
  const logs = useLiveQuery(
    () =>
      db(currentProfile)
        .logs.where({ game_id: params.game_id as string })
        .toArray(),
    []
  );
  const quizes = useLiveQuery(() => db(currentProfile).quizes.toArray(), []);
  const quizsetList = Array.from(new Set(quizes?.map((quiz) => quiz.set_name)));

  if (!game || !players || !logs) return <NotFound />;

  const deleteGame = async () => {
    await db(currentProfile).games.delete(game.id);
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
      <h3>{rules[game.rule].name}</h3>
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
            ? "red.500!important"
            : "white!important",
          _dark: {
            borderColor: playButtonIsDisabled
              ? "red.300!important"
              : "gray.800!important",
          },
        }}
      >
        <Flex>
          <List className="text-red-500 dark:text-red-300">
            {errorMessages.map((m) => (
              <List.Item key={m}>{m}</List.Item>
            ))}
          </List>
          {playButtonIsDisabled ? (
            <Button
              disabled={playButtonIsDisabled}
              leftSection={<PlayerPlay />}
              size="lg"
            >
              ゲーム開始
            </Button>
          ) : (
            <ButtonLink
              size="lg"
              href={`/games/${params.game_id}/board`}
              leftSection={<PlayerPlay />}
            >
              ゲーム開始
            </ButtonLink>
          )}
        </Flex>
      </Box>
      <Box>
        <Tabs variant="outline">
          <Tabs.List>
            <Tabs.Tab value="rule">形式設定</Tabs.Tab>
            <Tabs.Tab value="player">プレイヤー設定</Tabs.Tab>
            <Tabs.Tab value="other">その他の設定</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="rule">
            <h2>形式設定</h2>
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
            <h2>その他の設定</h2>
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
            <Title order={4}>ゲームのコピーを作成</Title>
            <CopyGame game={game} />
            <Title order={4}>エクスポート</Title>
            <ExportGame game={game} />
            <Title order={4}>ゲームを削除</Title>
            <Button leftSection={<Trash />} onClick={showDeleteGameConfirm}>
              削除する
            </Button>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </>
  );
}
