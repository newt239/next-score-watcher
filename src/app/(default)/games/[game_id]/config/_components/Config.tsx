"use client";

import { useRouter } from "next/navigation";

import { Accordion, Box, Button, Tabs, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useLiveQuery } from "dexie-react-hooks";
import { Trash } from "tabler-icons-react";

import ConfigInput from "./ConfigInput";
import CopyGame from "./CopyGame";
import ExportGame from "./ExportGame";
import GameStartButton from "./GameStartButton/GameStartButton";
import PlayersConfig from "./PlayersConfig";
import RuleSettings from "./RuleSettings";
import SelectQuizset from "./SelectQuizset";

import NotFound from "@/app/(default)/_components/NotFound";
import Link from "@/app/_components/Link";
import db from "@/utils/db";
import { rules } from "@/utils/rules";

type Props = {
  game_id: string;
  currentProfile: string;
};

const Config: React.FC<Props> = ({ game_id, currentProfile }) => {
  const router = useRouter();
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );
  const players = useLiveQuery(
    () => db(currentProfile).players.orderBy("name").toArray(),
    []
  );
  const logs = useLiveQuery(
    () =>
      db(currentProfile)
        .logs.where({ game_id: game_id as string })
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
      <GameStartButton game={game} logs={logs} disabled={disabled} />
      <Tabs
        pt="lg"
        variant="outline"
        orientation="horizontal"
        defaultValue="rule"
      >
        <Tabs.List my="lg" grow>
          <Tabs.Tab size="1.5rem" value="rule">
            形式設定
          </Tabs.Tab>
          <Tabs.Tab value="player">プレイヤー設定</Tabs.Tab>
          <Tabs.Tab value="other">その他の設定</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="rule">
          <RuleSettings
            disabled={disabled}
            game={game}
            currentProfile={currentProfile}
          />
        </Tabs.Panel>
        <Tabs.Panel value="player">
          <PlayersConfig
            disabled={disabled}
            game_id={game.id}
            playerList={players}
            players={game.players}
            rule_name={game.rule}
            currentProfile={currentProfile}
          />
        </Tabs.Panel>
        <Tabs.Panel value="other">
          <SelectQuizset
            game_id={game.id}
            game_quiz={game.quiz}
            quizset_names={quizsetList}
            currentProfile={currentProfile}
          />
          <h3>オプション</h3>
          <ConfigInput
            label="Discord Webhook"
            input_id="discord_webhook_url"
            placeholder="https://discord.com/api/webhooks/..."
            currentProfile={currentProfile}
            type="url"
          />
          <h3>ゲーム</h3>
          <CopyGame game={game} currentProfile={currentProfile} />
          <Title order={4}>エクスポート</Title>
          <ExportGame game={game} currentProfile={currentProfile} />
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
    </>
  );
};

export default Config;
