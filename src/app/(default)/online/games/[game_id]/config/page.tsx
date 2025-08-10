import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Config from "./_components/Config/Config";

import { getUser } from "@/utils/auth/auth-helpers";

export const metadata: Metadata = {
  title: "ゲーム設定",
  robots: {
    index: false,
  },
};

const ConfigPage = async ({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) => {
  const { game_id } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <Config game_id={game_id} user={user} />;
};

export default ConfigPage;
