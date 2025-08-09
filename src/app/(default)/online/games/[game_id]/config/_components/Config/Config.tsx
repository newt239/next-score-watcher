"use client";

import { useState, useEffect } from "react";

import { Accordion, Box, Tabs } from "@mantine/core";

import GameStartButton from "../GameStartButton/GameStartButton";
import OtherConfig from "../OtherConfig";
import PlayersConfig from "../PlayersConfig";
import RuleSettings from "../RuleSettings";

import classes from "./Config.module.css";

import type { RuleNames, LogDBProps, GameDBPlayerProps } from "@/utils/types";

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

type CloudGame = {
  id: string;
  name: string;
  ruleType: RuleNames;
  createdAt: string;
  updatedAt: string;
  discordWebhookUrl?: string | null;
};

const Config: React.FC<Props> = ({ game_id, user }) => {
  const [game, setGame] = useState<CloudGame | null>(null);
  const [players, setPlayers] = useState<GameDBPlayerProps[]>([]);
  const [logs, setLogs] = useState<LogDBProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const apiClient = await createApiClient();
        const [gameResponse, playersResponse, logsResponse] = await Promise.all(
          [
            apiClient["games"][":gameId"].$get(
              { param: { gameId: game_id } },
              {
                headers: { "x-user-id": user.id },
              }
            ),
            apiClient["players"].$get(
              { query: {} },
              {
                headers: { "x-user-id": user.id },
              }
            ),
            apiClient["games"][":gameId"]["logs"].$get(
              { param: { gameId: game_id } },
              {
                headers: { "x-user-id": user.id },
              }
            ),
          ]
        );

        const gameData = await gameResponse.json();
        const playersData = await playersResponse.json();
        const logsData = await logsResponse.json();

        if ("game" in gameData) {
          setGame(gameData.game);
        }
        if ("players" in playersData) {
          setPlayers(playersData.players as GameDBPlayerProps[]);
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

  if (loading || !game || !players) return <NotFound />;

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
            <RuleSettings />
          </Tabs.Panel>
          <Tabs.Panel value="player">
            <PlayersConfig />
          </Tabs.Panel>
          <Tabs.Panel value="other">
            <OtherConfig />
          </Tabs.Panel>
        </Box>
      </Tabs>
    </>
  );
};

export default Config;
