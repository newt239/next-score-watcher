"use client";

import { useState, useTransition } from "react";

import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { type UserPreferences } from "@/models/user-preferences";
import apiClient from "@/utils/hono/client";

type Props = {
  initialPreferences: UserPreferences;
  userId: string;
};

const UserPreferencesSettings: React.FC<Props> = ({
  initialPreferences,
  userId,
}) => {
  const [preferences, setPreferences] =
    useState<UserPreferences>(initialPreferences);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev: UserPreferences) => ({ ...prev, [key]: value }));

    startTransition(async () => {
      try {
        const response = await apiClient.user[":user_id"].preferences.$patch({
          param: { user_id: userId },
          json: { [key]: value },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (result.status !== "success") {
          throw new Error("API returned error status");
        }

        notifications.show({
          title: "設定を保存しました",
          message: "設定が正常に保存されました。",
          color: "green",
        });
      } catch (error) {
        console.error(error);
        notifications.show({
          title: "エラー",
          message: "設定の保存に失敗しました。",
          color: "red",
        });
        // エラー時は設定を元に戻す
        setPreferences((prev: UserPreferences) => ({
          ...prev,
          [key]: initialPreferences[key],
        }));
      }
    });
  };

  return (
    <Box mt="xl">
      <Title order={3} mb="md">
        表示設定
      </Title>

      <Flex direction="column" gap="md" mb="xl">
        <Switch
          checked={preferences.theme === "dark"}
          onChange={(event) => {
            const newTheme = event.currentTarget.checked ? "dark" : "light";
            handleUpdate("theme", newTheme);
          }}
          label="ダークモード"
          size="md"
          disabled={isPending}
        />

        <Switch
          checked={preferences.showWinthroughPopup}
          onChange={(event) => {
            handleUpdate("showWinthroughPopup", event.currentTarget.checked);
          }}
          label="勝ち抜け時にポップアップを表示"
          size="md"
          disabled={isPending}
        />

        <Switch
          checked={preferences.showBoardHeader}
          onChange={(event) => {
            handleUpdate("showBoardHeader", event.currentTarget.checked);
          }}
          label="ヘッダーを表示"
          size="md"
          disabled={isPending}
        />

        <Switch
          checked={preferences.showQn}
          onChange={(event) => {
            handleUpdate("showQn", event.currentTarget.checked);
          }}
          label="ヘッダーに問題番号を表示"
          size="md"
          disabled={isPending}
        />

        <Switch
          checked={preferences.showSignString}
          onChange={(event) => {
            handleUpdate("showSignString", event.currentTarget.checked);
          }}
          label="スコアに「○」「✕」「pt」の文字列を付与する"
          size="md"
          disabled={isPending}
        />

        <Switch
          checked={preferences.reversePlayerInfo}
          onChange={(event) => {
            handleUpdate("reversePlayerInfo", event.currentTarget.checked);
          }}
          label="スコアを名前の上に表示"
          size="md"
          disabled={isPending}
        />

        <Switch
          checked={preferences.wrongNumber}
          onChange={(event) => {
            handleUpdate("wrongNumber", event.currentTarget.checked);
          }}
          label="誤答数が4以下のとき✕の数で表示"
          description="誤答数が0のときは中黒・で表示されます。"
          size="md"
          disabled={isPending}
        />
      </Flex>

      <Divider mb="md" />

      <Title order={3} mb="md">
        Webhook設定
      </Title>

      <Text size="sm" c="dimmed" mb="md">
        イベント発生時に設定されたURLへPOSTリクエストを送信します。
      </Text>

      <Group gap="md" mb="xl">
        <TextInput
          placeholder="https://example.com/webhook"
          type="url"
          value={preferences.webhookUrl || ""}
          onChange={(event) => {
            const value = event.currentTarget.value;
            setPreferences((prev: UserPreferences) => ({
              ...prev,
              webhookUrl: value || null,
            }));
          }}
          onBlur={() => {
            handleUpdate("webhookUrl", preferences.webhookUrl);
          }}
          style={{ flex: 1 }}
          disabled={isPending}
        />
        <Button
          onClick={() => handleUpdate("webhookUrl", preferences.webhookUrl)}
          loading={isPending}
          size="sm"
        >
          保存
        </Button>
      </Group>
    </Box>
  );
};

export default UserPreferencesSettings;
