"use client";

import { useState, useEffect } from "react";

import { Accordion, Box, Tabs } from "@mantine/core";

import CloudGameStartButton from "../CloudGameStartButton/CloudGameStartButton";
import CloudOtherConfig from "../CloudOtherConfig";
import CloudPlayersConfig from "../CloudPlayersConfig";
import CloudRuleSettings from "../CloudRuleSettings";

import classes from "./CloudConfig.module.css";

import NotFound from "@/app/(default)/_components/NotFound";
import Link from "@/app/_components/Link";
import { authClient } from "@/utils/auth/auth-client";
import apiClient from "@/utils/hono/client";
import { rules } from "@/utils/rules";

type Props = {
  game_id: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Game = {
  id: string;
  name: string;
  ruleType: string;
};

const CloudConfig: React.FC<Props> = ({ game_id }) => {
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<unknown[]>([]);
  const [logs, setLogs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authClient.getSession();
        setUser(session?.data?.user || null);
      } catch (error) {
        console.error("Failed to get user session:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [gameResponse, playersResponse, logsResponse] = await Promise.all(
          [
            apiClient["cloud-games"][":gameId"].$get(
              { param: { gameId: game_id } },
              {
                headers: { "x-user-id": user.id },
              }
            ),
            apiClient["cloud-players"].$get(
              {},
              {
                headers: { "x-user-id": user.id },
              }
            ),
            apiClient["cloud-games"][":gameId"]["logs"].$get(
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
          setPlayers(playersData.players);
        }
        if ("logs" in logsData) {
          setLogs(
            logsData.logs.filter(
              (log: { system: number; available: number }) =>
                log.system === 0 && log.available === 1
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
      <CloudGameStartButton game={game} logs={logs} />
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
            <CloudRuleSettings />
          </Tabs.Panel>
          <Tabs.Panel value="player">
            <CloudPlayersConfig />
          </Tabs.Panel>
          <Tabs.Panel value="other">
            <CloudOtherConfig />
          </Tabs.Panel>
        </Box>
      </Tabs>
    </>
  );
};

export default CloudConfig;
