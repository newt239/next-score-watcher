import { cdate } from "cdate";
import { AdjustmentsHorizontal } from "tabler-icons-react";

import Anchor from "#/app/_components/Anchor";
import ButtonLink from "#/app/_components/ButtonLink";
import Card from "#/app/_components/Card";
import { rules } from "#/utils/rules";
import { serverClient } from "#/utils/supabase";
import { RuleNames } from "#/utils/types";
import { css } from "@panda/css";

export const metadata = {
  title: "作成したゲーム | Score Watcher",
};

export default async function PlayersConfigPage({
  searchParams,
}: {
  searchParams: { order?: "updated_at" | "name" };
}) {
  const { data: games } = await serverClient
    .from("games")
    .select()
    .order(searchParams.order || "updated_at", { ascending: true });

  return (
    <>
      <div
        className={css({
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        })}
      >
        <h2>作成したゲーム</h2>
      </div>
      {!games || games.length === 0 ? (
        <p>
          作成済みのゲームはありません。
          <Anchor href="/rules">形式一覧</Anchor>
          ページから新しいゲームを作ることが出来ます。
        </p>
      ) : (
        <div
          className={css({
            display: "grid",
            gap: 3,
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            pt: 3,
          })}
        >
          {games.map((game) => (
            <Card key={game.id} title={game.name}>
              <p>
                {rules[game.rule as RuleNames].name} ／ {game.players?.length}人
              </p>
              <div
                className={css({
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                })}
              >
                <div className={css({ fontSize: "70%", opacity: 0.5 })}>
                  {cdate(game.updated_at).format("MM/DD HH:mm")}
                </div>
                <ButtonLink
                  href={`games/${game.id}/config`}
                  leftIcon={<AdjustmentsHorizontal />}
                  size="sm"
                >
                  開く
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
