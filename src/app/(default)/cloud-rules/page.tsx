import type { Metadata } from "next";

import CloudRuleList from "./_components/CloudRuleList/CloudRuleList";

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

  return <CloudRuleList userId={user?.id} />;
};

export default CloudRulesPage;
