"use client";

import { useLocalStorage } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "next/navigation";

import NotFound from "@/app/(default)/_components/NotFound";
import { CURRENT_PROFILE_STORAGE_KEY, DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";
import db from "@/utils/db";

import OtherConfig from "./OtherConfig";

const OtherTab: React.FC = () => {
  const { game_id } = useParams<{ game_id: string }>();
  const [storedCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: DEFAULT_CURRENT_PROFILE,
  });
  const game = useLiveQuery(
    () => db(storedCurrentProfile).games.get(game_id),
    [storedCurrentProfile, game_id]
  );

  if (!game) return <NotFound />;

  return <OtherConfig game={game} currentProfile={storedCurrentProfile} />;
};

export default OtherTab;
