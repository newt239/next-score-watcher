"use client";

import { Suspense } from "react";

import { Tabs, Title } from "@mantine/core";

import CreatePlayer from "../CreatePlayer/CreatePlayer";
import ImportPlayer from "../ImportPlayer/ImportPlayer";
import LoadPlayer from "../LoadPlayer/LoadPlayer";
import PlayersTable from "../PlayersTable";

import classes from "./ManagePlayer.module.css";

type Props = {
  currentProfile: string;
};

const ManagePlayer: React.FC<Props> = ({ currentProfile }) => {
  return (
    <>
      <Title order={2}>プレイヤー管理</Title>
      <h3>プレイヤーの読み込み</h3>
      <Tabs pt="lg" variant="outline" defaultValue="add">
        <Tabs.List mt="lg" grow>
          <Tabs.Tab value="add">個別に追加</Tabs.Tab>
          <Tabs.Tab value="paste">貼り付け</Tabs.Tab>
          <Tabs.Tab value="import">インポート</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="add" className={classes.tab_panel}>
          <Suspense>
            {/* ref: https://qiita.com/nk175/items/5b437355e9c2c3e59e19 */}
            <CreatePlayer currentProfile={currentProfile} />
          </Suspense>
        </Tabs.Panel>
        <Tabs.Panel value="paste" className={classes.tab_panel}>
          <LoadPlayer currentProfile={currentProfile} />
        </Tabs.Panel>
        <Tabs.Panel value="import" className={classes.tab_panel}>
          <ImportPlayer currentProfile={currentProfile} />
        </Tabs.Panel>
      </Tabs>

      <PlayersTable currentProfile={currentProfile} />
    </>
  );
};

export default ManagePlayer;
