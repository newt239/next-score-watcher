import type { Metadata } from "next";

import RuleTab from "./_components/RuleTab";

export const metadata: Metadata = {
  title: "ゲーム設定 - 形式設定",
  robots: {
    index: false,
  },
};

const RulePage = () => <RuleTab />;

export default RulePage;
