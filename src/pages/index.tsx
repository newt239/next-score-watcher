import { useEffect } from "react";

import { Container } from "@chakra-ui/react";

import Features from "#/features/home/Features";
import GameList from "#/features/home/GameList";
import Hero from "#/features/home/Hero";
import Term from "#/features/home/Term";

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "Score Watcher";
  }, []);

  return (
    <>
      <Hero />
      <Container>
        <GameList />
        <Features />
        <Term />
      </Container>
    </>
  );
};

export default HomePage;
