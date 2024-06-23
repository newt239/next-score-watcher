import { Metadata } from "next";

import { Title } from "@mantine/core";

import InitializeApp from "./_components/InitializeApp";
import WebhookSettings from "./_components/WebhookSettings";

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
    </>
  );
}
