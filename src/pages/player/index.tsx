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
    <Container>
      {from && (
        <Box>
          <Button
            as={ReactLink}
            to={`/${from}/config`}
            colorScheme="green"
            variant="ghost"
            leftIcon={<ArrowBackUp />}
          >
            ゲーム設定に戻る
          </Button>
        </Box>
      )}
      <h2>プレイヤー管理</h2>
      <Box>
        <h3>プレイヤーの読み込み</h3>
        <Tabs isFitted variant="enclosed" colorScheme="green" pt={5}>
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
