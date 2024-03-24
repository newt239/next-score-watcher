import { useEffect } from "react";

import { Container } from "@chakra-ui/react";

import RuleList from "#/features/components/RuleList";
import OtherRules from "#/features/home/OtherRules";

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
