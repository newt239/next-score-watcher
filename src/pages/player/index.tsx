import { Link as ReactLink } from "react-router-dom";
import { useParams } from "react-router-dom";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ArrowBackUp } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import CreatePlayer from "#/components/player/CreatePlayer";
import ImportPlayer from "#/components/player/ImportPlayer";
import LoadPlayer from "#/components/player/LoadPlayer";
import PlayerTable from "#/components/player/PlayerTable";

const PlayerPage = () => {
  const { from } = useParams();
  return (
    <>
      {typeof from === "string" && (
        <Box>
          <ReactLink to={`/${from}/config`}>
            <Button
              colorScheme="green"
              variant="ghost"
              leftIcon={<ArrowBackUp />}
            >
              設定に戻る
            </Button>
          </ReactLink>
        </Box>
      )}
      <H2>プレイヤー管理</H2>
      <Box>
        <H3>プレイヤーの読み込み</H3>
        <Tabs isFitted variant="enclosed" colorScheme="green" pt={5}>
          <TabList mb="1em">
            <Tab>個別に追加</Tab>
            <Tab>まとめて貼り付け</Tab>
            <Tab>ファイルからインポート</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CreatePlayer
                from={typeof from === "string" ? from : undefined}
              />
            </TabPanel>
            <TabPanel>
              <LoadPlayer />
            </TabPanel>
            <TabPanel>
              <ImportPlayer />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Alert status="success" mt={5}>
          <AlertIcon />
          <Box>
            <AlertTitle>サブテキストとは？</AlertTitle>
            <AlertDescription>
              名前や所属の上に表示される文字列です。ペーパー順位の表示用等にお使いください。
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
      <PlayerTable />
    </>
  );
};

export default PlayerPage;
