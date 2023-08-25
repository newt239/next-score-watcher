import { useEffect } from "react";

import { Container } from "@chakra-ui/react";

import RuleList from "#/components/block/RuleList";
import OtherRules from "#/components/home/OtherRules";

const RulePage: React.FC = () => {
  useEffect(() => {
    document.title = "形式一覧｜Score Watcher";
  }, []);

  return (
    <Container>
      <RuleList />
      <OtherRules />
    </Container>
  );
};

export default RulePage;
