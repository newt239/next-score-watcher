import { Metadata } from "next";

import { Container } from "@chakra-ui/react";

import OtherRules from "#/app/(default)/rules/_components/OtherRules";
import RuleList from "#/app/(default)/rules/_components/RuleList";

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
