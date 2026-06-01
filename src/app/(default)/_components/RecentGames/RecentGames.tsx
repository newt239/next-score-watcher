"use client";

import { Box, Group, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconList } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";

import ButtonLink from "@/components/ButtonLink";
import { CURRENT_PROFILE_STORAGE_KEY } from "@/utils/current-profile";
import db from "@/utils/db";
import { parseGameList } from "@/utils/parseGameList";

import GameListGrid from "../../games/_components/GameListGrid/GameListGrid";

type Props = {
  currentProfile: string;
};

const RECENT_GAMES_COUNT = 3;

/** トップページで作成済みゲームの先頭数件を表示するセクション。ゲームが無ければ何も描画しない */
const RecentGames: React.FC<Props> = ({ currentProfile }) => {
  const [storedCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: currentProfile,
  });
  const games = useLiveQuery(
    () => db(storedCurrentProfile).games.orderBy("last_open").reverse().toArray(),
    [storedCurrentProfile]
  );
  const logs = useLiveQuery(() => db(storedCurrentProfile).logs.toArray(), [storedCurrentProfile]);

  if (games === undefined || games.length === 0) return null;

  const recentGames = parseGameList(games, logs, "last_open").slice(0, RECENT_GAMES_COUNT);

  return (
    <Box>
      <Group justify="space-between" align="center" mb="md">
        <Title order={2} style={{ padding: 0 }}>
          最近のゲーム
        </Title>
        <ButtonLink href="/games" leftSection={<IconList />} size="sm" variant="white">
          すべて見る
        </ButtonLink>
      </Group>
      <GameListGrid gameList={recentGames} />
    </Box>
  );
};

export default RecentGames;
