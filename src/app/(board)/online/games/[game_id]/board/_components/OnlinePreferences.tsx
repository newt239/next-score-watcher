"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Flex,
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { IconInfoCircle } from "@tabler/icons-react";

import type { UserPreferencesType } from "@/models/user-preferences";

import { defaultUserPreferences } from "@/models/user-preferences";
import createApiClient from "@/utils/hono/client";

type Props = {
  userId: string;
};

const OnlinePreferences: React.FC<Props> = ({ userId }) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  // API経由でユーザー設定を管理
  const [preferences, setPreferences] = useState<UserPreferencesType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 設定を取得
  const fetchPreferences = useCallback(async () => {
    try {
      const apiClient = createApiClient();
      const res = await apiClient["user"][":user_id"]["preferences"].$get({
        param: { user_id: userId },
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data.preferences);
        setIsAuthenticated(true);
      } else if (res.status === 404) {
        // ユーザーが認証されていない場合、デフォルト設定を使用
        console.warn("User not authenticated, using default preferences");
        setIsAuthenticated(false);
        setPreferences(defaultUserPreferences);
      } else {
        console.error("Failed to fetch preferences:", res.status);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
      // エラーが発生した場合もデフォルト設定を使用
      setIsAuthenticated(false);
      setPreferences(defaultUserPreferences);
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
      {isAuthenticated === false && (
        <Alert
          icon={<IconInfoCircle size={16} />}
          title="ゲストモード"
          color="blue"
          variant="light"
        >
          サインインしていないため、設定の変更はこのセッション中のみ有効です。
        </Alert>
      )}
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
