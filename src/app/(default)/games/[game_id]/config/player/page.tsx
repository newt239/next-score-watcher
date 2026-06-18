import type { Metadata } from "next";

import PlayerTab from "./_components/PlayerTab";

export const metadata: Metadata = {
  title: "ゲーム設定 - プレイヤー設定",
  robots: {
    index: false,
  },
};

const PlayerPage = () => <PlayerTab />;

export default PlayerPage;
