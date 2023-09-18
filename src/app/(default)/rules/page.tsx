import { Metadata } from "next";

import OtherRules from "#/app/(default)/rules/_components/OtherRules";
import RuleList from "#/app/(default)/rules/_components/RuleList";

export const metadata: Metadata = {
  title: "形式一覧 | Score Watcher",
};

export default function RulesPage() {
  return (
    <>
      <RuleList />
      <OtherRules />
    </>
  );
}
