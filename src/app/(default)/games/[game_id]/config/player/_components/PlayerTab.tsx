"use client";

import { useLocalStorage } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "next/navigation";

import NotFound from "@/app/(default)/_components/NotFound";
import { CURRENT_PROFILE_STORAGE_KEY, DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";
import db from "@/utils/db";

import PlayersConfig from "./PlayersConfig";

const PlayerTab: React.FC = () => {
  const { game_id } = useParams<{ game_id: string }>();
  const [storedCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: DEFAULT_CURRENT_PROFILE,
  });
  const game = useLiveQuery(
    () => db(storedCurrentProfile).games.get(game_id),
    [storedCurrentProfile, game_id]
  );
  const players = useLiveQuery(
    () => db(storedCurrentProfile).players.orderBy("name").toArray(),
    [storedCurrentProfile]
  );

  if (!game || !players) return <NotFound />;

  return (
    <PlayersConfig
      game_id={game.id}
      rule={game.rule}
      playerList={players}
      players={game.players}
      currentProfile={storedCurrentProfile}
    />
  );
};

export default PlayerTab;
