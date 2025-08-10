"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Flex,
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";

import type { UserPreferencesType } from "@/models/user-preferences";

import createApiClient from "@/utils/hono/client";

const OnlinePreferences: React.FC = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  // API経由でユーザー設定を管理
  const [preferences, setPreferences] = useState<UserPreferencesType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const apiClient = createApiClient();

  // 設定を取得
  const fetchPreferences = useCallback(async () => {
    try {
      const res = await apiClient["user"][":user_id"]["preferences"].$get({
        param: { user_id: "current" }, // 認証されたユーザーのID
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  // 設定を更新
  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferencesType>) => {
      if (!preferences) return;

      try {
        const res = await apiClient["user"][":user_id"]["preferences"].$patch({
          param: { user_id: "current" },
          json: updates,
        });
        if (res.ok) {
          setPreferences({ ...preferences, ...updates });
        }
      } catch (error) {
        console.error("Failed to update preferences:", error);
      }
    },
    [apiClient, preferences]
  );

  // 初期設定取得
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // 設定更新のヘルパー関数
  const updateSetting = useCallback(
    async <T extends keyof UserPreferencesType>(
      key: T,
      value: UserPreferencesType[T],
      eventName: string
    ) => {
      await updatePreferences({ [key]: value });

      // GAイベント送信
      sendGAEvent({
        event: eventName,
        value: String(value),
      });
    },
    [updatePreferences]
  );

  if (isLoading || !preferences) {
    return <div>設定を読み込み中...</div>;
  }

  return (
    <Flex direction="column" gap="lg" mb="lg">
      <Switch
        checked={computedColorScheme === "dark"}
        onChange={() => {
          const newTheme = computedColorScheme === "dark" ? "light" : "dark";
          setColorScheme(newTheme);
          updateSetting("theme", newTheme, "switch_dark_mode");
        }}
        label="ダークモード"
        size="md"
      />
      <Switch
        checked={preferences.showWinthroughPopup}
        onChange={(event) => {
          updateSetting(
            "showWinthroughPopup",
            event.currentTarget.checked,
            "show_winthrough_popup"
          );
        }}
        label="勝ち抜け時にポップアップを表示"
        size="md"
      />
      <Switch
        checked={preferences.showBoardHeader}
        onChange={(event) => {
          updateSetting(
            "showBoardHeader",
            event.currentTarget.checked,
            "show_board_header"
          );
        }}
        label="ヘッダーを表示"
        size="md"
      />
      <Switch
        checked={preferences.showQn}
        onChange={(event) => {
          updateSetting("showQn", event.currentTarget.checked, "show_qn");
        }}
        label="ヘッダーに問題番号を表示"
        size="md"
      />
      <Switch
        checked={preferences.showSignString}
        onChange={(event) => {
          updateSetting(
            "showSignString",
            event.currentTarget.checked,
            "show_sign_string"
          );
        }}
        label="スコアに「○」「✕」「pt」の文字列を付与する"
        size="md"
      />
      <Switch
        checked={preferences.reversePlayerInfo}
        onChange={(event) => {
          updateSetting(
            "reversePlayerInfo",
            event.currentTarget.checked,
            "reverse_player_info"
          );
        }}
        label="スコアを名前の上に表示"
        size="md"
      />
      <Switch
        checked={preferences.wrongNumber}
        onChange={(event) => {
          updateSetting(
            "wrongNumber",
            event.currentTarget.checked,
            "wrong_number"
          );
        }}
        label="誤答数が4以下のとき✕の数で表示"
        description="誤答数が0のときは中黒・で表示されます。"
        size="md"
      />
    </Flex>
  );
};

export default OnlinePreferences;
