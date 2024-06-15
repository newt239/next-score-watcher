"use client";

import { Suspense } from "react";

import { Tabs, Title } from "@mantine/core";

import CreatePlayer from "./CreatePlayer";
import ImportPlayer from "./ImportPlayer";
import LoadPlayer from "./LoadPlayer";
import PlayersTable from "./PlayersTable";

const ManagePlayer = () => {
  return (
    <>
      <Title order={2}>プレイヤー管理</Title>
      <h3>プレイヤーの読み込み</h3>
      <Tabs pt="lg" variant="outline" defaultValue="add">
        <Tabs.List my="lg" grow>
          <Tabs.Tab value="add">個別に追加</Tabs.Tab>
          <Tabs.Tab value="paste">貼り付け</Tabs.Tab>
          <Tabs.Tab value="import">インポート</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="add">
          <Suspense>
            {/* ref: https://qiita.com/nk175/items/5b437355e9c2c3e59e19 */}
            <CreatePlayer />
          </Suspense>
        </Tabs.Panel>
        <Tabs.Panel value="paste">
          <LoadPlayer />
        </Tabs.Panel>
        <Tabs.Panel value="import">
          <ImportPlayer />
        </Tabs.Panel>
      </Tabs>

      <PlayersTable />
    </>
  );
};

export default ManagePlayer;
