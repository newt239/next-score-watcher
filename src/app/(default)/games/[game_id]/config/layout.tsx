"use client";

import { Accordion, Tabs } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

import NotFound from "@/app/(default)/_components/NotFound";
import AppLink from "@/components/Link";
import { CURRENT_PROFILE_STORAGE_KEY, DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";
import db from "@/utils/db";
import { rules } from "@/utils/rules";

import GameStartButton from "./_components/GameStartButton/GameStartButton";
import classes from "./layout.module.css";

const ConfigLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { game_id } = useParams<{ game_id: string }>();
  const segment = useSelectedLayoutSegment();
  const activeTab = segment ?? "player";

  const [storedCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: DEFAULT_CURRENT_PROFILE,
  });
  const game = useLiveQuery(
    () => db(storedCurrentProfile).games.get(game_id),
    [storedCurrentProfile, game_id]
  );
  const logs = useLiveQuery(
    () => db(storedCurrentProfile).logs.where({ game_id, system: 0, available: 1 }).toArray(),
    [storedCurrentProfile, game_id]
  );

  if (!game || !logs) return <NotFound />;

  const tabHref = (tab: string) => `/games/${game_id}/config/${tab}`;

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
              <AppLink href={`https://docs.score-watcher.com/rules/${game.rule}`}>
                ヘルプサイト
              </AppLink>
              をご覧ください。
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <GameStartButton game={game} logs={logs} disabled={logs.length !== 0} />
      <Tabs pt="lg" variant="outline" value={activeTab} className={classes.tabs_area}>
        <Tabs.List mt="lg" grow className={classes.tab_list}>
          <Tabs.Tab
            value="rule"
            renderRoot={(props) => (
              <Link
                href={tabHref("rule")}
                {...props}
                aria-current={activeTab === "rule" ? "page" : undefined}
              />
            )}
          >
            形式設定
          </Tabs.Tab>
          <Tabs.Tab
            value="player"
            renderRoot={(props) => (
              <Link
                href={tabHref("player")}
                {...props}
                aria-current={activeTab === "player" ? "page" : undefined}
              />
            )}
          >
            プレイヤー設定
          </Tabs.Tab>
          <Tabs.Tab
            value="other"
            renderRoot={(props) => (
              <Link
                href={tabHref("other")}
                {...props}
                aria-current={activeTab === "other" ? "page" : undefined}
              />
            )}
          >
            その他の設定
          </Tabs.Tab>
        </Tabs.List>
        <div className={classes.tab_panel}>{children}</div>
      </Tabs>
    </>
  );
};

export default ConfigLayout;
