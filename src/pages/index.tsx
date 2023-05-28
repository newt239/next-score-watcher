import { useEffect } from "react";

import { Container } from "@chakra-ui/react";

import Features from "#/components/home/Features";
import GameList from "#/components/home/GameList";
import Hero from "#/components/home/Hero";
import Term from "#/components/home/Term";

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "Score Watcher";
  }, []);

  return (
    <>
      <Hero />
      <Container>
        <Features />
        <GameList />
        <Term />
      </Container>
    </>
  );
};

export default HomePage;
