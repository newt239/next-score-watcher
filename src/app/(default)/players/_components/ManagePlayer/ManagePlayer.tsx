"use client";

import { Suspense } from "react";

import { Tabs, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import { CURRENT_PROFILE_STORAGE_KEY } from "@/utils/current-profile";

import CreatePlayer from "../CreatePlayer/CreatePlayer";
import ImportPlayer from "../ImportPlayer/ImportPlayer";
import LoadPlayer from "../LoadPlayer/LoadPlayer";
import PlayersTable from "../PlayersTable";
import classes from "./ManagePlayer.module.css";

type Props = {
  currentProfile: string;
  from?: string;
};

const ManagePlayer: React.FC<Props> = ({ currentProfile, from }) => {
  const [storedCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: currentProfile,
  });

  return (
    <>
      <Title order={2}>プレイヤー管理</Title>
      <h3>プレイヤーの読み込み</h3>
      <Tabs pt="lg" variant="outline" defaultValue="add">
        <Tabs.List mt="lg" grow className={classes.tab_list}>
          <Tabs.Tab value="add">個別に追加</Tabs.Tab>
          <Tabs.Tab value="paste">貼り付け</Tabs.Tab>
          <Tabs.Tab value="import">インポート</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="add" className={classes.tab_panel}>
          <Suspense>
            {/* ref: https://qiita.com/nk175/items/5b437355e9c2c3e59e19 */}
            <CreatePlayer currentProfile={storedCurrentProfile} from={from} />
          </Suspense>
        </Tabs.Panel>
        <Tabs.Panel value="paste" className={classes.tab_panel}>
          <LoadPlayer currentProfile={storedCurrentProfile} />
        </Tabs.Panel>
        <Tabs.Panel value="import" className={classes.tab_panel}>
          <ImportPlayer currentProfile={storedCurrentProfile} />
        </Tabs.Panel>
      </Tabs>

      <PlayersTable currentProfile={storedCurrentProfile} />
    </>
  );
};

export default ManagePlayer;
