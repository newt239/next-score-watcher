import Link from "next/link";

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

import CreatePlayer from "#/app/(default)/players/_components/CreatePlayer";
import ImportPlayer from "#/app/(default)/players/_components/ImportPlayer";
import LoadPlayer from "#/app/(default)/players/_components/LoadPlayer";
import PlayerTable from "#/app/(default)/players/_components/PlayerTable";

export const metadata = {
  title: "プレイヤー管理 | Score Watcher",
};

export default function PlayersConfigPage({
  searchParams,
}: {
  searchParams: { from: string };
}) {
  return (
    <Container pt={5}>
      <Box pt={5}>
        {searchParams.from && (
          <Box>
            <Button
              as={Link}
              colorScheme="green"
              href={`/${searchParams.from}/config`}
              leftIcon={<ArrowBackUp />}
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
              <Tab>貼り付け</Tab>
              <Tab>インポート</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <CreatePlayer from={searchParams.from || undefined} />
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
      </Box>
    </Container>
  );
}
