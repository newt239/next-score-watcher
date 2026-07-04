import type { Metadata } from "next";

import { DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";

import Board from "./_components/Board/Board";
import InAppBrowserWarning from "./_components/InAppBrowserWarning/InAppBrowserWarning";

export const metadata: Metadata = {
  title: "得点表示",
  robots: {
    index: false,
  },
};

const BoardPage = async ({ params }: { params: Promise<{ game_id: string }> }) => {
  const { game_id } = await params;

  return (
    <>
      <InAppBrowserWarning />
      <Board game_id={game_id} current_profile={DEFAULT_CURRENT_PROFILE} />
    </>
  );
};

export default BoardPage;
