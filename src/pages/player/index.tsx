import { NextPageWithLayout } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

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
import { Layout } from "#/layouts/Layout";

const PlayerPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { from } = router.query;

  return (
    <>
      <Head>
        <title>プレイヤー管理 - Score Watcher</title>
      </Head>
      {typeof from === "string" && (
        <Box>
          <Button
            colorScheme="green"
            variant="link"
            onClick={() => router.push({ pathname: `/${from}/config` })}
            leftIcon={<ArrowBackUp />}
          >
            設定に戻る
          </Button>
        </Box>
      )}
      <H2>プレイヤー管理</H2>
      <Box>
        <H3>プレイヤーの読み込み</H3>
        <Tabs isFitted variant="enclosed" pt={5}>
          <TabList mb="1em">
            <Tab>個別に追加</Tab>
            <Tab>まとめて貼り付け</Tab>
            <Tab>ファイルからインポート</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CreatePlayer />
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

PlayerPage.getLayout = (page) => <Layout>{page}</Layout>;

export default PlayerPage;
