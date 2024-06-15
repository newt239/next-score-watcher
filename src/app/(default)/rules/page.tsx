import { Metadata } from "next";

import OtherRules from "./_components/OtherRules";
import RuleList from "./_components/RuleList/RuleList";

export const metadata: Metadata = {
  title: "形式一覧",
};

export default function RulesPage() {
  return (
    <>
      <RuleList />
      <OtherRules />
    </>
  );
}
