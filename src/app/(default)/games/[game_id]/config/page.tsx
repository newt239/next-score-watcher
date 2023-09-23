import { Metadata } from "next";
import { useRouter } from "next/navigation";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import { PlayerPlay, Trash } from "tabler-icons-react";

import ConfigInput from "#/app/(default)/games/[game_id]/config/_components/ConfigInput";
import CopyGame from "#/app/(default)/games/[game_id]/config/_components/CopyGame";
import PlayersConfig from "#/app/(default)/games/[game_id]/config/_components/PlayersConfig";
import RuleSettings from "#/app/(default)/games/[game_id]/config/_components/RuleSettings";
import SelectQuizset from "#/app/(default)/games/[game_id]/config/_components/SelectQuizSet";
import Button from "#/app/_components/Button";
import ButtonLink from "#/app/_components/ButtonLink";
import Card from "#/app/_components/Card";
import FormControl from "#/app/_components/FormControl";
import { Tab, TabItem } from "#/app/_components/Tab";
import InputLayout from "#/components/common/InputLayout";
import db from "#/utils/db";
import { rules } from "#/utils/rules";
import { Database } from "#/utils/schema";
import { RuleNames } from "#/utils/types";
import { css } from "@panda/css";

export const metadata: Metadata = {
  title: "ゲーム設定 | Score Watcher",
};

export default async function GameConfigPage({
  params,
}: {
  params: { game_id: string };
}) {
  const game_id = params.game_id;
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("id", game_id)
    .single();
  const { data: game_players } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", game_id)
    .order("id");
  const { data: game_logs } = await supabase
    .from("game_logs")
    .select("*")
    .eq("game_id", game_id);
  const { data: quizsets } = await supabase.from("quizsets").select("*");

  if (!game || !game_players || !game_logs) return null;

  const deleteGame = async () => {
    await db.games.delete(game.id);
    toast("ゲームを削除しました");
    router.push("/");
  };

  const disabled = game_logs.length !== 0;

  const errorMessages = [];
  if (game_players.length === 0)
    errorMessages.push("「プレイヤー設定」からプレイヤーを選択してください。");
  if (game.win_through && game_players.length <= game.win_through)
    errorMessages.push(
      "「勝ち抜け人数」はプレイヤーの人数より少なくしてください。"
    );
  if (disabled)
    errorMessages.push(
      `現在${
        game_logs.length + 1
      }問目です。ゲームが開始済みであるため、一部の設定は変更できません。`
    );

  const playButtonIsDisabled =
    errorMessages.filter((t) => t.indexOf("ゲームが開始済み") === -1).length !==
    0;

  return (
    <>
      <Card>
        <h3>{rules[game.rule as RuleNames].name}</h3>
        <div>
          {rules[game.rule as RuleNames].description.split("\n").map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Card>
      <FormControl
        label={
          <ul
            className={css({
              color: "red.500",
              _dark: {
                color: "red.300",
              },
            })}
          >
            {errorMessages.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        }
      >
        <ButtonLink
          aria-disabled={playButtonIsDisabled}
          href={`/${game_id}/board`}
          leftIcon={<PlayerPlay />}
          variants={{
            size: "lg",
          }}
        >
          ゲーム開始
        </ButtonLink>
      </FormControl>

      <div>
        <Tab defaultKey="rule">
          <TabItem tabKey="rule" title="形式設定">
            <RuleSettings disabled={disabled} game={game} />
          </TabItem>
          <TabItem tabKey="player" title="プレイヤー設定">
            <PlayersConfig
              disabled={disabled}
              game_id={game.id}
              playerList={game_players}
              players={game_players}
              rule_name={game.rule as RuleNames}
            />
          </TabItem>
          <TabItem tabKey="other" title="その他の設定">
            <div>
              <SelectQuizset
                game_id={game.id}
                game_quiz={game.quiz}
                quizset_names={quizsets}
              />
            </div>
            <div>
              <h3>オプション</h3>
              <ConfigInput
                input_id="discord_webhook_url"
                label="Discord Webhook"
                placeholder="https://discord.com/api/webhooks/..."
                type="url"
              />
            </div>
            <div>
              <h3>ゲーム</h3>
              <InputLayout label="ゲームのコピーを作成">
                <CopyGame game={game} />
              </InputLayout>
              <InputLayout label="ゲームを削除">
                <Button leftIcon={<Trash />}>削除する</Button>
              </InputLayout>
            </div>
          </TabItem>
        </Tab>
      </div>
    </>
  );
}
