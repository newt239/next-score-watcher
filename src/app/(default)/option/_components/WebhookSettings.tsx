"use client";

import { Text, TextInput, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import Link from "@/app/_components/Link";

const WebhookSettings: React.FC = () => {
  // 常にlocalStorageを使用（従来通り）
  const [webhookUrl, setWebhookUrl] = useLocalStorage({
    key: "scorew-webhook-url",
    defaultValue: "",
  });

  const handleWebhookUrlChange = (value: string) => {
    setWebhookUrl(value);
  };

  return (
    <>
      <Title order={3}>Webhook</Title>
      <Text>
        イベント発生時に設定されたURLへPOSTリクエストを送信します。 詳しくは
        <Link href="/option/webhook">webhookについて</Link>
        を御覧ください。
      </Text>
      <TextInput
        onChange={(v) => handleWebhookUrlChange(v.target.value)}
        placeholder="https://score-watcher.com/api"
        type="url"
        value={webhookUrl}
        mb="lg"
      />
    </>
  );
};

export default WebhookSettings;
