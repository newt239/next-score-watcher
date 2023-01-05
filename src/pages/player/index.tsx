import { NextPageWithLayout } from "next";

import { useLiveQuery } from "dexie-react-hooks";

import H2 from "#/blocks/H2";
import PlayerTable from "#/components/PlayerTable";
import { Layout } from "#/layouts/Layout";
import db, { PlayerDBProps } from "#/utils/db";

const PlayerPage: NextPageWithLayout = () => {
  const players = useLiveQuery(() => db.players.toArray(), []);

  return (
    <>
      <H2>プレイヤー管理</H2>
      <PlayerTable />
    </>
  );
};

PlayerPage.getLayout = (page) => <Layout>{page}</Layout>;

export default PlayerPage;
