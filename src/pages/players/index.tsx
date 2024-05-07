import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { ArrowBackUp } from "tabler-icons-react";

import ButtonLink from "~/components/common/ButtonLink";
import CreatePlayer from "~/components/players/CreatePlayer";
import ImportPlayer from "~/components/players/ImportPlayer";
import LoadPlayer from "~/components/players/LoadPlayer";
import PlayerTable from "~/components/players/PlayerTable";

const PlayerPage = () => {
  const [params] = useSearchParams();
  const from = params.get("from");

  useEffect(() => {
    document.title = "プレイヤー管理 | Score Watcher";
  }, []);

  return (
    <>
      {from && (
        <div>
          <ButtonLink href={`/games/${from}/config`} leftIcon={<ArrowBackUp />}>
            ゲーム設定に戻る
          </ButtonLink>
        </div>
      )}
      <h2>プレイヤー管理</h2>
      <h3>プレイヤーの読み込み</h3>
      <Tabs colorScheme="green" isFitted pt={5} variant="enclosed">
        <TabList mb="12px">
          <Tab>個別に追加</Tab>
          <Tab>貼り付け</Tab>
          <Tab>インポート</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CreatePlayer from={from || undefined} />
          </TabPanel>
          <TabPanel>
            <LoadPlayer />
          </TabPanel>
          <TabPanel>
            <ImportPlayer />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <PlayerTable />
    </>
  );
};

export default PlayerPage;
