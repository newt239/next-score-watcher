"use client";

import { Accordion, Tabs } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";

import NotFound from "@/app/(default)/_components/NotFound";
import Link from "@/components/Link";
import { CURRENT_PROFILE_STORAGE_KEY } from "@/utils/current-profile";
import db from "@/utils/db";
import { rules } from "@/utils/rules";

import GameStartButton from "../GameStartButton/GameStartButton";
import OtherConfig from "../OtherConfig";
import PlayersConfig from "../PlayersConfig";
import RuleSettings from "../RuleSettings";
import classes from "./Config.module.css";

type Props = {
  game_id: string;
  currentProfile: string;
};

const Config: React.FC<Props> = ({ game_id, currentProfile }) => {
  const [storedCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: currentProfile,
  });
  const game = useLiveQuery(
    () => db(storedCurrentProfile).games.get(game_id as string),
    [storedCurrentProfile, game_id]
  );
  const players = useLiveQuery(
    () => db(storedCurrentProfile).players.orderBy("name").toArray(),
    [storedCurrentProfile]
  );
  const logs = useLiveQuery(
    () =>
      db(storedCurrentProfile)
        .logs.where({ game_id: game_id as string, system: 0, available: 1 })
        .toArray(),
    [storedCurrentProfile, game_id]
  );

  if (!game || !players || !logs) return <NotFound />;

  const disabled = logs.length !== 0;

  return (
    <>
      <h2>{rules[game.rule].name}</h2>
      <Accordion variant="separated">
        <Accordion.Item value="rule_description">
          <Accordion.Control>{rules[game.rule].short_description}</Accordion.Control>
          <Accordion.Panel pb={4}>
            <p>{rules[game.rule]?.description}</p>
            <p>
              より詳細な説明は
              <Link href={`https://docs.score-watcher.com/rules/${game.rule}`}>ヘルプサイト</Link>
              をご覧ください。
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <GameStartButton game={game} logs={logs} disabled={disabled} />
      <Tabs pt="lg" variant="outline" defaultValue="player" className={classes.tabs_area}>
        <Tabs.List mt="lg" grow className={classes.tab_list}>
          <Tabs.Tab value="rule">形式設定</Tabs.Tab>
          <Tabs.Tab value="player">プレイヤー設定</Tabs.Tab>
          <Tabs.Tab value="other">その他の設定</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="rule" className={classes.tab_panel}>
          <RuleSettings game={game} currentProfile={storedCurrentProfile} />
        </Tabs.Panel>
        <Tabs.Panel value="player" className={classes.tab_panel}>
          <PlayersConfig
            game_id={game.id}
            rule={game.rule}
            playerList={players}
            players={game.players}
            currentProfile={storedCurrentProfile}
          />
        </Tabs.Panel>
        <Tabs.Panel value="other" className={classes.tab_panel}>
          <OtherConfig game={game} currentProfile={storedCurrentProfile} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Config;
