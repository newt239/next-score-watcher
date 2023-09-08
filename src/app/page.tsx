import { Container } from "tabler-icons-react";

import Features from "#/components/home/Features";
import GameList from "#/components/home/GameList";
import Hero from "#/components/home/Hero";
import Term from "#/components/home/Term";

export default function Home() {
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
}
