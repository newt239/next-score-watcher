import { useEffect } from "react";

import OtherRules from "~/components/rules/OtherRules";
import RuleList from "~/components/rules/RuleList";

const RulePage: React.FC = () => {
  useEffect(() => {
    document.title = "形式一覧｜Score Watcher";
  }, []);

  return (
    <>
      <RuleList />
      <OtherRules />
    </>
  );
};

export default RulePage;
