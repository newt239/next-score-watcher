"use client";

import { useEffect, useState } from "react";

import { Text, TextInput, Title } from "@mantine/core";

import Link from "@/app/_components/Link";

const WebhookSettings = () => {
  const [WebhookUrl, setWebhookUrl] = useState<string>("");

  useEffect(() => {
    const url = window.localStorage.getItem("scorew-webhook-url");
    if (url) {
      setWebhookUrl(url);
    }
  }, []);

  return (
    <>
      <Title order={3}>Webhook</Title>
      <Text>
        イベント発生時に設定されたURLへPOSTリクエストを送信します。 詳しくは
        <Link href="/option/webhook">webhookについて</Link>
        を御覧ください。
      </Text>
      <TextInput
        onChange={(v) => {
          setWebhookUrl(v.target.value);
          window.localStorage.setItem("scorew-webhook-url", v.target.value);
        }}
        placeholder="https://score-watcher.com/api"
        type="url"
        value={WebhookUrl}
        mb="lg"
      />
    </>
  );
};

export default WebhookSettings;
