"use client";

import { Tabs, Title } from "@mantine/core";

import CreatePlayer from "./_components/CreatePlayer";
import ImportPlayer from "./_components/ImportPlayer";
import LoadPlayer from "./_components/LoadPlayer";
import PlayersTable from "./_components/PlayersTable";

export default function PlayerPage() {
  return (
    <>
      <Title order={2}>プレイヤー管理</Title>
      <h3>プレイヤーの読み込み</h3>
      <Tabs variant="outline" defaultValue="add">
        <Tabs.List>
          <Tabs.Tab value="add">個別に追加</Tabs.Tab>
          <Tabs.Tab value="paste">貼り付け</Tabs.Tab>
          <Tabs.Tab value="import">インポート</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="add">
          <CreatePlayer />
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
}
