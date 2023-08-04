import { useEffect } from "react";
import { Link as ReactLink, useSearchParams } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ArrowBackUp } from "tabler-icons-react";

import CreatePlayer from "#/components/player/CreatePlayer";
import ImportPlayer from "#/components/player/ImportPlayer";
import LoadPlayer from "#/components/player/LoadPlayer";
import PlayerTable from "#/components/player/PlayerTable";

const PlayerPage = () => {
  const [params] = useSearchParams();
  const from = params.get("from");

  useEffect(() => {
    document.title = "プレイヤー管理 | Score Watcher";
  }, []);

  return (
    <Container pt={5}>
      {from && (
        <Box>
          <Button
            as={ReactLink}
            colorScheme="green"
            leftIcon={<ArrowBackUp />}
            to={`/${from}/config`}
            variant="ghost"
          >
            ゲーム設定に戻る
          </Button>
        </Box>
      )}
      <h2>プレイヤー管理</h2>
      <Box pt={5}>
        <h3>プレイヤーの読み込み</h3>
        <Tabs colorScheme="green" isFitted pt={5} variant="enclosed">
          <TabList mb="1em">
            <Tab>個別に追加</Tab>
            <Tab>まとめて貼り付け</Tab>
            <Tab>ファイルからインポート</Tab>
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
      </Box>
      <PlayerTable />
    </Container>
  );
};

export default PlayerPage;
