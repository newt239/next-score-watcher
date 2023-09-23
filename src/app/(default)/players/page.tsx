import { ArrowBackUp } from "tabler-icons-react";

import CreatePlayer from "./_components/CreatePlayer";
import ImportPlayer from "./_components/ImportPlayer";
import LoadPlayer from "./_components/LoadPlayer";

import ButtonLink from "#/app/_components/ButtonLink";
import { Tab, TabItem } from "#/app/_components/Tab";

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
            <ButtonLink href={`/${searchParams.from}/config`}>
              ゲーム設定に戻る
              <ArrowBackUp />
            </ButtonLink>
          </div>
        )}
        <h2>プレイヤー管理</h2>
        <div>
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
      </div>
    </>
  );
}
