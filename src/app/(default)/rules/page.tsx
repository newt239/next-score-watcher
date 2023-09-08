import { Metadata } from "next";

import { Container } from "@chakra-ui/react";

import RuleList from "#/components/block/RuleList";
import OtherRules from "#/components/home/OtherRules";

export const metadata: Metadata = {
  title: "形式一覧 | Score Watcher",
};

export default function RulesPage() {
  return (
    <Container pt={5}>
      <RuleList />
      <OtherRules />
    </Container>
  );
}
