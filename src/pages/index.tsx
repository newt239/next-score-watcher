import { NextPageWithLayout } from "next";
import Head from "next/head";

import GameList from "#/components/home/GameList";
import Hero from "#/components/home/Hero";
import RuleList from "#/components/home/RuleList";
import UpdateModal from "#/components/home/UpdateModal";
import { Layout } from "#/layouts/Layout";

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Score Watcher</title>
      </Head>
      <Hero />
      <GameList />
      <RuleList />
      <UpdateModal />
    </>
  );
};

HomePage.getLayout = (page) => <Layout>{page}</Layout>;

export default HomePage;
