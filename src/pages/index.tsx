import { useEffect } from "react";

import Features from "~/features/home/Features";
import Hero from "~/features/home/Hero";
import Term from "~/features/home/Term";

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
