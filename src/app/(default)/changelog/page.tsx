import type { Metadata } from "next";

import Changelog from "./_components/Changelog";

export const metadata: Metadata = {
  title: "アップデート履歴",
  alternates: {
    canonical: "https://score-watcher.com/changelog",
  },
};

const ChangelogPage = () => {
  return <Changelog />;
};

export default ChangelogPage;
