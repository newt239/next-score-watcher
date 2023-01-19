import { NextPageWithLayout } from "next";
import Head from "next/head";

import { Grid } from "@chakra-ui/react";

import H2 from "#/blocks/H2";
import CreatePlayer from "#/components/player/CreatePlayer";
import LoadPlayer from "#/components/player/LoadPlayer";
import PlayerTable from "#/components/player/PlayerTable";
import { Layout } from "#/layouts/Layout";

const PlayerPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>プレイヤー管理 - Score Watcher</title>
      </Head>
      <H2>プレイヤー管理</H2>
      <LoadPlayer />
      <PlayerTable />
    </>
  );
};

PlayerPage.getLayout = (page) => <Layout>{page}</Layout>;

export default PlayerPage;
