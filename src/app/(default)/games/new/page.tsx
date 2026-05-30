import type { Metadata } from "next";
import { Suspense } from "react";

import NewGame from "./_components/NewGame/NewGame";

export const metadata: Metadata = {
  title: "ゲームを作成",
  robots: {
    index: false,
  },
};

const NewGamePage = () => {
  return (
    <Suspense>
      <NewGame />
    </Suspense>
  );
};

export default NewGamePage;
