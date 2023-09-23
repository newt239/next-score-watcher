"use client";

import CreatePlayer from "./CreatePlayer";
import ImportPlayer from "./ImportPlayer";
import LoadPlayer from "./LoadPlayer";

import { Tab, TabItem } from "#/components/Tab";

type PlayersConfigTabProps = {
  from?: string;
};

const PlayersConfigTab: React.FC<PlayersConfigTabProps> = ({ from }) => {
  return (
    <Tab defaultKey="create-player">
      <TabItem tabKey="create-player" title="個別に追加">
        <CreatePlayer from={from || undefined} />
      </TabItem>
      <TabItem tabKey="paste-player" title="貼り付け">
        <LoadPlayer />
      </TabItem>
      <TabItem tabKey="import-player" title="インポート">
        <ImportPlayer />
      </TabItem>
    </Tab>
  );
};

export default PlayersConfigTab;
