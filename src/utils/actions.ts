"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "./schema";
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
