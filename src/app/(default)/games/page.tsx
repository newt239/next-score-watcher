import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cdate } from "cdate";
import { AdjustmentsHorizontal } from "tabler-icons-react";

import Anchor from "#/app/_components/Anchor";
import ButtonLink from "#/app/_components/ButtonLink";
import Card from "#/app/_components/Card";
import { css } from "@panda/css";

export const metadata = {
  title: "作成したゲーム | Score Watcher",
};

export default async function PlayersConfigPage({
  searchParams,
}: {
  searchParams: { order?: "last_open" | "name" };
}) {
  const supabase = await createServerComponentClient({ cookies });
  const { data: games } = await supabase.from("games").select();

  return (
    <>
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            pt: 3,
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          })}
        >
          {games.map((game) => (
            <Card
              className={css({
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 3,
                p: 3,
              })}
              key={game.id}
              title={game.name}
            >
              <div>
                <p>
                  {game.type} ／ {game.player_count}人
                </p>
                <p>進行状況: {game.state}</p>
              </div>
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                })}
              >
                <div className={css({ fontSize: "70%", opacity: 0.5 })}>
                  {cdate(game.last_open).format("MM/DD HH:mm")}
                </div>
                <ButtonLink
                  href={`games/${game.id}/config`}
                  leftIcon={<AdjustmentsHorizontal />}
                  variants={{ size: "sm" }}
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
