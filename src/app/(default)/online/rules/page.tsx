import type { Metadata } from "next";

import RuleList from "./_components/RuleList/RuleList";

import { getUser } from "@/utils/auth/auth-helpers";

export const metadata: Metadata = {
  title: "クラウドゲーム作成",
  alternates: {
    canonical: "https://score-watcher.com/cloud-rules",
  },
  robots: {
    index: false,
  },
};

const CloudRulesPage = async () => {
  const user = await getUser();

  return <RuleList userId={user?.id} />;
};

export default CloudRulesPage;
