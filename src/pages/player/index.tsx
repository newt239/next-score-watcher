import { NextPageWithLayout } from "next";
import Head from "next/head";

import { Grid } from "@chakra-ui/react";

import H2 from "#/blocks/H2";
import CreatePlayer from "#/components/CreatePlayer";
import LoadPlayer from "#/components/LoadPlayer";
import PlayerTable from "#/components/PlayerTable";
import { Layout } from "#/layouts/Layout";

const PlayerPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>プレイヤー管理</title>
      </Head>
      <H2>プレイヤー管理</H2>
      <Grid py={5} gap={5} templateColumns="repeat(2, 1fr)">
        <CreatePlayer />
        <LoadPlayer />
      </Grid>
      <PlayerTable />
    </>
  );
};

PlayerPage.getLayout = (page) => <Layout>{page}</Layout>;

export default PlayerPage;
