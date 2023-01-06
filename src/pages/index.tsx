import { NextPageWithLayout } from "next";
import Head from "next/head";

import GameList from "#/components/GameList";
import RuleList from "#/components/RuleList";
import UpdateModal from "#/components/UpdateModal";
import { Layout } from "#/layouts/Layout";

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Score Watcher</title>
        <meta
          name="description"
          content="クイズ大会におけるプレイヤーの得点状況を可視化します。"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameList />
      <RuleList />
      <UpdateModal />
    </>
  );
};

HomePage.getLayout = (page) => <Layout>{page}</Layout>;

export default HomePage;
