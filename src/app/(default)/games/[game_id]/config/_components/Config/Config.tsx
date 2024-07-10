"use client";

import { Accordion, Box, Tabs } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import GameStartButton from "../GameStartButton/GameStartButton";
import OtherConfig from "../OtherConfig";
import PlayersConfig from "../PlayersConfig";
import RuleSettings from "../RuleSettings";

import classes from "./Config.module.css";

import NotFound from "@/app/(default)/_components/NotFound";
import Link from "@/app/_components/Link/Link";
import db from "@/utils/db";
import { rules } from "@/utils/rules";

type Props = {
  game_id: string;
  currentProfile: string;
};

const Config: React.FC<Props> = ({ game_id, currentProfile }) => {
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

  if (!game || !players || !logs) return <NotFound />;

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
            <RuleSettings game={game} currentProfile={currentProfile} />
          </Tabs.Panel>
          <Tabs.Panel value="player">
            <PlayersConfig
              game_id={game.id}
              rule={game.rule}
              playerList={players}
              players={game.players}
              currentProfile={currentProfile}
            />
          </Tabs.Panel>
          <Tabs.Panel value="other">
            <OtherConfig game={game} currentProfile={currentProfile} />
          </Tabs.Panel>
        </Box>
      </Tabs>
    </>
  );
};

export default Config;
