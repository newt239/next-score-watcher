import { useEffect } from "react";

import { Container } from "@chakra-ui/react";

import GameList from "#/components/home/GameList";
import Hero from "#/components/home/Hero";
import OtherRules from "#/components/home/OtherRules";
import RuleList from "#/components/home/RuleList";
import Term from "#/components/home/Term";
import UpdateModal from "#/components/home/UpdateModal";

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "ScoreWatcher";
  }, []);

  return (
    <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>
      <Hero />
      <GameList />
      <RuleList />
      <OtherRules />
      <Term />
      <UpdateModal />
    </Container>
  );
};

export default HomePage;
