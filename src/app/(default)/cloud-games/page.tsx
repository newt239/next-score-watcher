import type { Metadata } from "next";

import CloudGameList from "./_components/CloudGameList/CloudGameList";

export const metadata: Metadata = {
  title: "クラウドゲーム",
  robots: {
    index: false,
  },
};

const CloudGamesPage = () => {
  return <CloudGameList />;
};

export default CloudGamesPage;
