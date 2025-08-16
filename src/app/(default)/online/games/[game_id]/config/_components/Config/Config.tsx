"use client";

import { useState } from "react";

import { Accordion, Box, Tabs } from "@mantine/core";

import GameStartButton from "../GameStartButton/GameStartButton";
import OtherConfig from "../OtherConfig";
import PlayersConfig from "../PlayersConfig";
import RuleSettings from "../RuleSettings";

import classes from "./Config.module.css";

import type {
  GetGameDetailResponseType,
  OnlineUserType,
  PlayerProps,
} from "@/models/games";

import NotFound from "@/app/(default)/_components/NotFound";
import Link from "@/app/_components/Link";
import { rules } from "@/utils/rules";

type ConfigProps = {
  user: OnlineUserType | null;
  game: GetGameDetailResponseType;
  players: PlayerProps[];
};

const Config: React.FC<ConfigProps> = ({ user, game, players }) => {
  const [currentPlayerCount, setCurrentPlayerCount] = useState(
    game.players.length
  );

  if (!user) return <NotFound />;

  // プレイヤー変更時のコールバック
  const handlePlayersChange = (playerCount: number) => {
    setCurrentPlayerCount(playerCount);
  };

  return (
    <>
      <h2>{rules[game.ruleType]?.name || "不明な形式"}</h2>
      <Accordion variant="separated">
        <Accordion.Item value="rule_description">
          <Accordion.Control>
            {rules[game.ruleType].short_description}
          </Accordion.Control>
          <Accordion.Panel pb={4}>
            <p>{rules[game.ruleType].description}</p>
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
      <GameStartButton
        ruleType={game.ruleType}
        playerCount={currentPlayerCount}
        logCount={game.logs.length}
      />
      <Tabs
        pt="lg"
        variant="outline"
        defaultValue="rule"
        className={classes.tabs_area}
      >
        <Tabs.List className={classes.tab_list} grow>
          <Tabs.Tab value="rule" py="md">
            形式設定
          </Tabs.Tab>
          <Tabs.Tab value="player" py="md">
            プレイヤー設定
          </Tabs.Tab>
          <Tabs.Tab value="other" py="md">
            その他の設定
          </Tabs.Tab>
        </Tabs.List>
        <Box className={classes.tab_panel_area}>
          <Tabs.Panel value="rule">
            <RuleSettings gameId={game.id} ruleType={game.ruleType} />
          </Tabs.Panel>
          <Tabs.Panel value="player">
            <PlayersConfig
              game_id={game.id}
              rule={game.ruleType}
              players={players}
              gamePlayers={game.players}
              onPlayerCountChange={handlePlayersChange}
            />
          </Tabs.Panel>
          <Tabs.Panel value="other">
            <OtherConfig
              gameId={game.id}
              gameName={game.name}
              ruleType={game.ruleType}
              discordWebhookUrl={game.discordWebhookUrl || ""}
              isPublic={game.isPublic}
            />
          </Tabs.Panel>
        </Box>
      </Tabs>
    </>
  );
};

export default Config;
