import type { Metadata } from "next";

import NewGame from "./_components/NewGame/NewGame";

export const metadata: Metadata = {
  title: "ゲームを作成",
  robots: {
    index: false,
  },
};

const NewGamePage = () => {
  return <NewGame />;
};

export default NewGamePage;
