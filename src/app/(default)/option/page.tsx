import type { Metadata } from "next";

import { Title } from "@mantine/core";

import Preferences from "@/app/(default)/option/_components/Preferences";
import { DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";

import InitializeApp from "./_components/InitializeApp";
import ManageData from "./_components/ManageData/ManageData";
import MigrateToPlus from "./_components/MigrateToPlus";
import WebhookSettings from "./_components/WebhookSettings";

export const metadata: Metadata = {
  title: "アプリ設定",
  alternates: {
    canonical: "https://score-watcher.com/option",
  },
};

const OptionPage = async () => {
  return (
    <>
      <Title order={2}>アプリ設定</Title>
      <Title order={3}>表示設定</Title>
      <Preferences />
      <WebhookSettings />
      <ManageData currentProfile={DEFAULT_CURRENT_PROFILE} />
      {process.env.NEXT_PUBLIC_HIDE_PLUS_MIGRATION !== "true" && (
        <MigrateToPlus currentProfile={DEFAULT_CURRENT_PROFILE} />
      )}
      <InitializeApp currentProfile={DEFAULT_CURRENT_PROFILE} />
    </>
  );
};

export default OptionPage;
