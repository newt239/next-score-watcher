"use client";

import { useEffect, useState } from "react";

import { Accordion, Box, Tabs } from "@mantine/core";
import { parseResponse } from "hono/client";

import GameStartButton from "../GameStartButton/GameStartButton";
import OtherConfig from "../OtherConfig";
import PlayersConfig from "../PlayersConfig";
import RuleSettings from "../RuleSettings";

import classes from "./Config.module.css";

import type {
  GameDBPlayerProps,
  GamePropsUnion,
  LogDBProps,
  PlayerDBProps,
  RuleNames,
} from "@/utils/types";

import NotFound from "@/app/(default)/_components/NotFound";
import Link from "@/app/_components/Link";
import createApiClient from "@/utils/hono/client";
import { rules } from "@/utils/rules";

type Props = {
  game_id: string;
  user: User | null;
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Game = {
  id: string;
  name: string;
  ruleType: RuleNames;
  createdAt: string;
  updatedAt: string;
  discordWebhookUrl?: string | null;
  players?: GameDBPlayerProps[];
};

const Config: React.FC<Props> = ({ game_id, user }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [allPlayers, setAllPlayers] = useState<PlayerDBProps[]>([]);
  const [logs, setLogs] = useState<LogDBProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const apiClient = createApiClient();
        const [gameData, playersData, logsData] = await Promise.all([
          parseResponse(
            apiClient["games"][":gameId"].$get({ param: { gameId: game_id } })
          ),
          parseResponse(apiClient["players"].$get({ query: {} })),
          parseResponse(
            apiClient["games"][":gameId"]["logs"].$get({
              param: { gameId: game_id },
            })
          ),
        ]);

        if ("game" in gameData) {
          setGame(gameData.game);
        }
        if ("players" in playersData) {
          setAllPlayers(playersData.players as PlayerDBProps[]);
        }
        if ("logs" in logsData) {
          setLogs(
            (logsData.logs as LogDBProps[]).filter(
              (log) => log.system === 0 && log.available === 1
            )
          );
        }
      } catch (error) {
        console.error("Failed to fetch cloud game data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [game_id, user?.id]);

  if (loading || !game || !user) return <NotFound />;

  return (
    <>
      <h2>
        {rules[game.ruleType as keyof typeof rules]?.name || "不明な形式"}
      </h2>
      <Accordion variant="separated">
        <Accordion.Item value="rule_description">
          <Accordion.Control>
            {rules[game.ruleType as keyof typeof rules]?.short_description ||
              ""}
          </Accordion.Control>
          <Accordion.Panel pb={4}>
            <p>
              {rules[game.ruleType as keyof typeof rules]?.description || ""}
            </p>
            <p>
              より詳細な説明は
              <Link
                href={`https://docs.score-watcher.com/rules/${game.ruleType}`}
              >
                ヘルプサイト
              </Link>
              をご覧ください。
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <GameStartButton game={game} logs={logs} />
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
            <RuleSettings gameId={game_id} ruleType={game.ruleType} />
          </Tabs.Panel>
          <Tabs.Panel value="player">
            <PlayersConfig
              game_id={game_id}
              rule={game.ruleType}
              playerList={allPlayers}
              players={game.players || []}
            />
          </Tabs.Panel>
          <Tabs.Panel value="other">
            <OtherConfig
              game={
                {
                  id: game.id,
                  name: game.name,
                  rule: game.ruleType,
                  discord_webhook_url: game.discordWebhookUrl || "",
                  players: game.players || [],
                  quiz: undefined,
                  correct_me: 0,
                  wrong_me: 0,
                  options:
                    game.ruleType === "aql"
                      ? { left_team: "", right_team: "" }
                      : undefined,
                  editable: false,
                  last_open: new Date().toISOString(),
                } as GamePropsUnion
              }
            />
          </Tabs.Panel>
        </Box>
      </Tabs>
    </>
  );
};

export default Config;
