import { useEffect } from "react";

import Features from "~/components/home/Features";
import Hero from "~/components/home/Hero";
import Term from "~/components/home/Term";

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "Score Watcher";
  }, []);

  return (
    <>
      <Hero />
      <Features />
      <Term />
    </>
  );
};

export default HomePage;
