import { Metadata } from "next";
import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { PlayerPlay, Trash } from "tabler-icons-react";

import ConfigTextInput from "./_components/ConfigTextInput";
import CopyGame from "./_components/CopyGame";
import PlayersConfig from "./_components/PlayersConfig";
import RuleSettings from "./_components/RuleSettings";
import SelectQuizset from "./_components/SelectQuizSet";

import Button from "#/app/_components/Button";
import ButtonLink from "#/app/_components/ButtonLink";
import Card from "#/app/_components/Card";
import { Tab, TabItem } from "#/app/_components/Tab";
import InputLayout from "#/components/common/InputLayout";
import { rules } from "#/utils/rules";
import { Database } from "#/utils/schema";
import { GameDBQuizProps, RuleNames } from "#/utils/types";
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
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: game } = await supabase
    .from("games")
    .select()
    .eq("id", game_id)
    .single();
  const { data: players } = await supabase.from("players").select("*");
  const { data: game_players } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", game_id);
  const { data: game_logs } = await supabase
    .from("game_logs")
    .select("*")
    .eq("game_id", game_id);
  const { data: quizsets } = await supabase.from("quizsets").select("*");

  if (!game || !game_players || !game_logs) return null;

  const disabled = game_logs.length !== 0;

  const errorMessages = [];
  if (!game.players || game.players.length === 0)
    errorMessages.push("「プレイヤー設定」からプレイヤーを選択してください。");
  if (
    game.win_through &&
    game.players &&
    game.players.length <= game.win_through
  )
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
      <Card title={rules[game.rule as RuleNames].name}>
        <div>
          {rules[game.rule as RuleNames].description.split("\n").map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Card>
      <div
        className={css({
          w: "100%",
          py: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          md: {
            flexDirection: "row",
          },
        })}
      >
        <div
          className={css({
            flexGrow: 1,
          })}
        >
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
        </div>
        <ButtonLink
          aria-disabled={playButtonIsDisabled}
          href={`/${game_id}/board`}
          leftIcon={<PlayerPlay />}
          size="lg"
          sx={{
            width: "100%",
            sm: {
              width: "auto",
            },
          }}
        >
          ゲーム開始
        </ButtonLink>
      </div>
      <div>
        <Tab defaultKey="rule">
          <TabItem tabKey="rule" title="形式設定">
            <RuleSettings
              disabled={disabled}
              game={game}
              game_players={game_players}
            />
          </TabItem>
          <TabItem tabKey="player" title="プレイヤー設定">
            <PlayersConfig
              disabled={disabled}
              game_id={game.id}
              game_player_ids={game.players || []}
              game_players={game_players || []}
              players={players || []}
              rule_name={game.rule as RuleNames}
            />
          </TabItem>
          <TabItem tabKey="other" title="その他の設定">
            <div>
              <SelectQuizset
                game_id={game.id}
                game_quiz={game.quiz as GameDBQuizProps}
                quizsets={quizsets}
              />
            </div>
            <div>
              <h3>オプション</h3>
              <ConfigTextInput
                defaultValue={game.discord_webhook_url || ""}
                game_id={game_id}
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
