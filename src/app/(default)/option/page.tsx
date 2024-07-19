import { Metadata } from "next";
import { cookies } from "next/headers";

import { Title } from "@mantine/core";

import InitializeApp from "./_components/InitializeApp";
import ManageData from "./_components/ManageData";
import WebhookSettings from "./_components/WebhookSettings";

import Preferences from "@/app/_components/Preferences";

export const metadata: Metadata = {
  title: "アプリ設定",
  alternates: {
    canonical: "https://score-watcher.com/option",
  },
};

export default function OptionPage() {
  const cookieStore = cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return (
    <>
      <Title order={2}>アプリ設定</Title>
      <Title order={3}>表示設定</Title>
      <Preferences />
      <WebhookSettings />
      <ManageData currentProfile={currentProfile} />
      <InitializeApp currentProfile={currentProfile} />
    </>
  );
}
