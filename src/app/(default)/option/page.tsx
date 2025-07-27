import { Metadata } from "next";
import { cookies } from "next/headers";

import { Title } from "@mantine/core";

import InitializeApp from "./_components/InitializeApp";
import ManageData from "./_components/ManageData/ManageData";
import WebhookSettings from "./_components/WebhookSettings";

import ServerPreferences from "@/app/_components/ServerPreferences";
import { getUser } from "@/utils/auth/auth-helpers";

export const metadata: Metadata = {
  title: "アプリ設定",
  alternates: {
    canonical: "https://score-watcher.com/option",
  },
};

export default async function OptionPage() {
  const cookieStore = await cookies();
  const profileListCookie = cookieStore.get("scorew_profile_list");
  const profileList = profileListCookie?.value
    ? JSON.parse(profileListCookie?.value)
    : [];
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  const user = await getUser();

  return (
    <>
      <Title order={2}>アプリ設定</Title>
      <Title order={3}>表示設定</Title>
      <ServerPreferences userId={user?.id} />
      <WebhookSettings userId={user?.id} />
      <ManageData profileList={profileList} currentProfile={currentProfile} />
      <InitializeApp currentProfile={currentProfile} />
    </>
  );
}
