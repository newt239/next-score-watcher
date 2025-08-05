import { Metadata } from "next";

import Features from "./_components/Features/Features";
import Hero from "./_components/Hero/Hero";
import Term from "./_components/Term";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://score-watcher.com/",
  },
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Term />
    </>
  );
};

export default HomePage;
