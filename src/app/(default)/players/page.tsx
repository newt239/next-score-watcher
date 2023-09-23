import { ArrowBackUp } from "tabler-icons-react";

import PlayersConfigTab from "./_components/PlayersConfigTab";

import ButtonLink from "#/components/ButtonLink";

export const metadata = {
  title: "プレイヤー管理 | Score Watcher",
};

export default function PlayersConfigPage({
  searchParams,
}: {
  searchParams: { from: string };
}) {
  return (
    <>
      <div>
        {searchParams.from && (
          <div>
            <ButtonLink href={`/${searchParams.from}/config`} variant="ghost">
              ゲーム設定に戻る
              <ArrowBackUp />
            </ButtonLink>
          </div>
        )}
        <h2>プレイヤー管理</h2>
        <div>
          <h3>プレイヤーの読み込み</h3>
          <PlayersConfigTab from={searchParams.from} />
        </div>
      </div>
    </>
  );
}
