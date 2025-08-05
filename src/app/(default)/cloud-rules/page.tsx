import type { Metadata } from "next";

import CloudRuleList from "./_components/CloudRuleList/CloudRuleList";

import { authClient } from "@/utils/auth/auth-client";

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
  const session = await authClient.getSession();
  const user = session?.data?.user || null;

  return <CloudRuleList userId={user?.id} />;
};

export default CloudRulesPage;
