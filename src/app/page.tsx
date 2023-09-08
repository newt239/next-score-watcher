import { Container } from "tabler-icons-react";

import Features from "#/app/_components/Features";
import GameList from "#/app/_components/GameList";
import Hero from "#/app/_components/Hero";
import Term from "#/app/_components/Term";

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
