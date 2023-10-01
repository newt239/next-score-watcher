import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ArrowBackUp } from "tabler-icons-react";

import CreatePlayer from "./_components/CreatePlayer";
import ImportPlayer from "./_components/ImportPlayer";
import LoadPlayer from "./_components/LoadPlayer";
import PlayerTable from "./_components/PlayerTable";

import ButtonLink from "#/app/_components/ButtonLink";
import { Tab, TabItem } from "#/app/_components/Tab";
import { Database } from "#/utils/schema";
import { css } from "@panda/css";

export const metadata = {
  title: "プレイヤー管理 | Score Watcher",
};

export default async function PlayersConfigPage({
  searchParams,
}: {
  searchParams: { from: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: players } = await supabase.from("players").select();

  return (
    <>
      <div>
        {searchParams.from && (
          <ButtonLink
            href={`/games/${searchParams.from}/config`}
            leftIcon={<ArrowBackUp />}
            variant="subtle"
          >
            ゲーム設定に戻る
          </ButtonLink>
        )}
        <h2>プレイヤー管理</h2>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            xl: {
              flexDirection: "row",
            },
          })}
        >
          <div
            className={css({
              xl: {
                width: "50%",
              },
            })}
          >
            <h3>プレイヤーの読み込み</h3>
            <Tab defaultKey="create-player">
              <TabItem tabKey="create-player" title="個別に追加">
                <CreatePlayer from={searchParams.from || undefined} />
              </TabItem>
              <TabItem tabKey="paste-player" title="貼り付け">
                <LoadPlayer />
              </TabItem>
              <TabItem tabKey="import-player" title="インポート">
                <ImportPlayer />
              </TabItem>
            </Tab>
          </div>
          <div
            className={css({
              xl: {
                width: "50%",
              },
            })}
          >
            <h3>プレイヤー一覧</h3>
            <PlayerTable players={players} />
          </div>
        </div>
      </div>
    </>
  );
}
