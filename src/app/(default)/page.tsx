import type { Metadata } from "next";

import { DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";

import Features from "./_components/Features/Features";
import Hero from "./_components/Hero/Hero";
import QuickLinks from "./_components/QuickLinks/QuickLinks";
import RecentGames from "./_components/RecentGames/RecentGames";
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
      <RecentGames currentProfile={DEFAULT_CURRENT_PROFILE} />
      <Features />
      <QuickLinks />
      <Term />
    </>
  );
};

export default HomePage;
