"use client";

import { Accordion, Box, Tabs } from "@mantine/core";

import GameStartButton from "../GameStartButton/GameStartButton";
import OtherConfig from "../OtherConfig";
import PlayersConfig from "../PlayersConfig";
import RuleSettings from "../RuleSettings";

import classes from "./Config.module.css";

import type {
  OnlineGameDBPlayerProps,
  OnlineGameLogType,
  OnlineGameType,
  OnlinePlayerDBProps,
  OnlineUserType,
} from "@/models/games";

import NotFound from "@/app/(default)/_components/NotFound";
import Link from "@/app/_components/Link";
import { rules } from "@/utils/rules";

type Props = {
  gameId: string;
  user: OnlineUserType | null;
  initialGame: OnlineGameType & {
    players: OnlineGameDBPlayerProps[];
    settings: Record<string, unknown>;
  };
  initialPlayers: OnlinePlayerDBProps[];
  initialLogs: OnlineGameLogType[];
};

const Config: React.FC<Props> = ({
  gameId,
  user,
  initialGame,
  initialPlayers,
  initialLogs,
}) => {
  if (!user) return <NotFound />;

  return (
    <>
      <h2>{rules[initialGame.ruleType]?.name || "不明な形式"}</h2>
      <Accordion variant="separated">
        <Accordion.Item value="rule_description">
          <Accordion.Control>
            {rules[initialGame.ruleType].short_description}
          </Accordion.Control>
          <Accordion.Panel pb={4}>
            <p>{rules[initialGame.ruleType].description}</p>
            <p>
              より詳細な説明は
              <Link
                href={`https://docs.score-watcher.com/rules/${initialGame.ruleType}`}
              >
                ヘルプサイト
              </Link>
              をご覧ください。
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <GameStartButton logs={initialLogs} game={initialGame} />
      <Tabs
        pt="lg"
        variant="outline"
        orientation="vertical"
        defaultValue="rule"
        className={classes.tabs_area}
      >
        <Tabs.List className={classes.tab_list}>
          <Tabs.Tab value="rule">形式設定</Tabs.Tab>
          <Tabs.Tab value="player">プレイヤー設定</Tabs.Tab>
          <Tabs.Tab value="other">その他の設定</Tabs.Tab>
        </Tabs.List>
        <Box className={classes.tab_panel_area}>
          <Tabs.Panel value="rule">
            <RuleSettings gameId={gameId} ruleType={initialGame.ruleType} />
          </Tabs.Panel>
          <Tabs.Panel value="player">
            <PlayersConfig
              game_id={gameId}
              rule={initialGame.ruleType}
              playerList={initialPlayers}
              players={initialGame.players}
            />
          </Tabs.Panel>
          <Tabs.Panel value="other">
            <OtherConfig
              game={{
                id: initialGame.id,
                name: initialGame.name,
                rule: initialGame.ruleType,
                discord_webhook_url: initialGame.discordWebhookUrl || "",
                correct_me: 0,
                wrong_me: 0,
                options:
                  initialGame.ruleType === "aql"
                    ? { left_team: "", right_team: "" }
                    : undefined,
                editable: false,
                last_open: new Date().toISOString(),
              }}
            />
          </Tabs.Panel>
        </Box>
      </Tabs>
    </>
  );
};

export default Config;
