"use client";

import { useEffect, useTransition } from "react";

import { Text, TextInput, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import {
  getUserPreferences,
  updateUserPreference,
} from "@/app/(default)/account/_actions/preferences";
import Link from "@/app/_components/Link";

type Props = {
  userId?: string;
};

const WebhookSettings: React.FC<Props> = ({ userId }) => {
  const [isPending, startTransition] = useTransition();

  // 常にlocalStorageを使用（従来通り）
  const [webhookUrl, setWebhookUrl] = useLocalStorage({
    key: "scorew-webhook-url",
    defaultValue: "",
  });

  // ログイン時にサーバーの設定をlocalStorageと同期
  useEffect(() => {
    if (userId) {
      startTransition(async () => {
        try {
          const serverPreferences = await getUserPreferences();
          if (serverPreferences?.webhookUrl) {
            // サーバーの設定をlocalStorageに反映
            setWebhookUrl(serverPreferences.webhookUrl);
          }
        } catch (error) {
          console.error("Webhook設定の読み込みに失敗しました:", error);
        }
      });
    }
  }, [userId, setWebhookUrl]);

  const handleWebhookUrlChange = (value: string) => {
    // 常にlocalStorageを更新
    setWebhookUrl(value);

    // ログイン時はサーバーにも保存
    if (userId) {
      startTransition(async () => {
        try {
          await updateUserPreference("webhookUrl", value || null);
        } catch (error) {
          console.error("Webhook設定の保存に失敗しました:", error);
          // エラー時はlocalStorageの変更は維持（オフライン動作を保持）
        }
      });
    }
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
        disabled={isPending}
      />
    </>
  );
};

export default WebhookSettings;
