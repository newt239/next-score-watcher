"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../../supabase/schema";

import { RuleNames } from "./types";

const supabase = createServerActionClient<Database>({ cookies });

type OnGameRecordUpdateProps = {
  game_id: string;
  input_id: string;
  new_value: string | number;
};

export const onGameRecordUpdate = async (props: OnGameRecordUpdateProps) => {
  await supabase
    .from("games")
    .update({ [props.input_id]: props.new_value })
    .eq("id", props.game_id);
};

type OnGameLimitToggleProps = {
  game_id: string;
  rule: RuleNames;
  checked: boolean;
};

export const onGameLimitToggle = async (props: OnGameLimitToggleProps) => {
  const newData: any = { limit: props.checked ? 10 : null };
  if (props.rule !== "attacksurvival") {
    newData.win_through = props.checked ? 3 : null;
  }
  await supabase.from("games").update(newData).eq("id", props.game_id);
  revalidatePath(`games/${props.game_id}/config`);
};

type OnGamePlayersUpdateProps = {
  game_id: string;
  players: {
    id: string;
    name: string;
  }[];
};

export const onGamePlayersUpdate = async (props: OnGamePlayersUpdateProps) => {
  await supabase
    .from("games")
    .update({ players: props.players.map((player) => player.id) })
    .eq("id", props.game_id);
  await supabase.from("game_players").upsert(
    props.players.map((player) => {
      return {
        game_id: props.game_id,
        id: `${props.game_id}_${player.id}`,
        name: player.name,
        player_id: player.id,
      };
    })
  );
  revalidatePath(`games/${props.game_id}/config`);
};
