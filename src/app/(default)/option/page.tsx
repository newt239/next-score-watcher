import { Metadata } from "next";

import { Title } from "@mantine/core";

import AppInfo from "./_components/AppInfo";
import InitializeApp from "./_components/InitializeApp";
import WebhookSettings from "./_components/WebhookSettings";

import Link from "@/app/_components/Link";
import Preferences from "@/app/_components/Preferences";

export const metadata: Metadata = {
  title: "アプリ設定",
};

export default function OptionPage() {
  return (
    <>
      <Title order={2}>アプリ設定</Title>
      <h3>表示設定</h3>
      <Preferences />
      <WebhookSettings />
      <InitializeApp />
      <h3>アプリ情報</h3>
      <p>
        アップデート情報は
        <Link href="https://github.com/newt239/next-score-watcher/releases">
          リリースノート
        </Link>
        をご確認ください。
      </p>
      <AppInfo />
    </>
  );
}
