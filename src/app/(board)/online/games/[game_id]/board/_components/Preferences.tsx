"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Flex,
  Skeleton,
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";

import type { UserPreferencesType } from "@/models/user-preference";

import { defaultUserPreferences } from "@/models/user-preference";
import createApiClient from "@/utils/hono/browser";

type PreferencesProps = {
  userId: string;
  initialPreferences: UserPreferencesType | null;
};

const Preferences: React.FC<PreferencesProps> = ({ userId, initialPreferences }) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  // 初期値を設定し、コンポーネントマウント時に最新設定を取得
  const [preferences, setPreferences] = useState<UserPreferencesType | null>(
    initialPreferences || defaultUserPreferences
  );
  const [isLoading, setIsLoading] = useState(false);

  // 最新の設定を取得（設定画面を開いたときのみ実行）
  const fetchLatestPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiClient = createApiClient();
      const res = await apiClient["user"][":user_id"]["preferences"].$get({
        param: { user_id: userId },
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data.preferences);
      } else {
        console.error("Failed to fetch preferences:", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 設定を更新
  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferencesType>) => {
      if (!preferences) return;

      try {
        const apiClient = createApiClient();
        const res = await apiClient["user"][":user_id"]["preferences"].$patch({
          param: { user_id: userId },
          json: updates,
        });
        if (res.ok) {
          setPreferences({ ...preferences, ...updates });
        } else if (res.status === 404) {
          // ユーザーが認証されていない場合、ローカル状態のみ更新
          console.warn("User not authenticated, updating local state only");
          setPreferences({ ...preferences, ...updates });
        } else {
          console.error("Failed to update preferences:", res.status);
          // エラーが発生してもローカル状態は更新する
          setPreferences({ ...preferences, ...updates });
        }
      } catch (error) {
        console.error("Failed to update preferences:", error);
        // エラーが発生してもローカル状態は更新する
        setPreferences({ ...preferences, ...updates });
      }
    },
    [preferences, userId]
  );

  // コンポーネントマウント時に最新設定を1回だけ取得
  useEffect(() => {
    fetchLatestPreferences();
  }, []); // 空の依存配列で1回だけ実行

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
    return (
      <Flex direction="column" gap="lg" mb="lg">
        <Skeleton height={36} radius="sm" />
        <Skeleton height={36} radius="sm" />
        <Skeleton height={36} radius="sm" />
        <Skeleton height={36} radius="sm" />
        <Skeleton height={36} radius="sm" />
        <Skeleton height={36} radius="sm" />
        <Skeleton height={60} radius="sm" />
      </Flex>
    );
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
          updateSetting("showBoardHeader", event.currentTarget.checked, "show_board_header");
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
          updateSetting("showSignString", event.currentTarget.checked, "show_sign_string");
        }}
        label="スコアに「○」「✕」「pt」の文字列を付与する"
        size="md"
      />
      <Switch
        checked={preferences.reversePlayerInfo}
        onChange={(event) => {
          updateSetting("reversePlayerInfo", event.currentTarget.checked, "reverse_player_info");
        }}
        label="スコアを名前の上に表示"
        size="md"
      />
      <Switch
        checked={preferences.wrongNumber}
        onChange={(event) => {
          updateSetting("wrongNumber", event.currentTarget.checked, "wrong_number");
        }}
        label="誤答数が4以下のとき✕の数で表示"
        description="誤答数が0のときは中黒・で表示されます。"
        size="md"
      />
    </Flex>
  );
};

export default Preferences;
