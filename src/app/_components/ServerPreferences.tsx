"use client";

import {
  Flex,
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { sendGAEvent } from "@next/third-parties/google";
import { useEffect, useTransition } from "react";

import {
  getUserPreferences,
  updateUserPreference,
} from "@/app/(default)/user/_actions/preferences";

type Props = {
  userId?: string;
};

const ServerPreferences: React.FC<Props> = ({ userId }) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const [isPending, startTransition] = useTransition();

  // 常にlocalStorageを使用（従来通り）
  const [showWinthroughPopup, setShowWinthroughPopup] = useLocalStorage({
    key: "showWinthroughPopup",
    defaultValue: true,
  });
  const [showBoardHeader, setShowBoardHeader] = useLocalStorage({
    key: "showBoardHeader",
    defaultValue: true,
  });
  const [showQn, setShowQn] = useLocalStorage({
    key: "showQn",
    defaultValue: false,
  });
  const [showSignString, setShowSignString] = useLocalStorage({
    key: "showSignString",
    defaultValue: true,
  });
  const [reversePlayerInfo, setReversePlayerInfo] = useLocalStorage({
    key: "reversePlayerInfo",
    defaultValue: false,
  });
  const [wrongNumber, setWrongNumber] = useLocalStorage({
    key: "wrongNumber",
    defaultValue: true,
  });

  // ログイン時にサーバーの設定をlocalStorageと同期
  useEffect(() => {
    if (userId) {
      startTransition(async () => {
        try {
          const serverPreferences = await getUserPreferences();
          if (serverPreferences) {
            // サーバーの設定をlocalStorageに反映
            setShowWinthroughPopup(serverPreferences.showWinthroughPopup);
            setShowBoardHeader(serverPreferences.showBoardHeader);
            setShowQn(serverPreferences.showQn);
            setShowSignString(serverPreferences.showSignString);
            setReversePlayerInfo(serverPreferences.reversePlayerInfo);
            setWrongNumber(serverPreferences.wrongNumber);
          }
        } catch (error) {
          console.error("サーバー設定の読み込みに失敗しました:", error);
        }
      });
    }
  }, [
    userId,
    setShowWinthroughPopup,
    setShowBoardHeader,
    setShowQn,
    setShowSignString,
    setReversePlayerInfo,
    setWrongNumber,
  ]);

  // 設定更新のヘルパー関数
  const updateSetting = <T,>(
    localSetter: (value: T) => void,
    serverKey: string,
    value: T,
    eventName: string
  ) => {
    // 常にlocalStorageを更新
    localSetter(value);

    // GAイベント送信
    sendGAEvent({
      event: eventName,
      value: String(value),
    });

    // ログイン時はサーバーにも保存
    if (userId) {
      startTransition(async () => {
        try {
          await updateUserPreference(serverKey as any, value);
        } catch (error) {
          console.error("サーバー設定の保存に失敗しました:", error);
          // エラー時はlocalStorageの変更は維持（オフライン動作を保持）
        }
      });
    }
  };

  return (
    <Flex direction="column" gap="lg" mb="lg">
      <Switch
        checked={computedColorScheme === "dark"}
        onChange={() => {
          const newTheme = computedColorScheme === "dark" ? "light" : "dark";
          setColorScheme(newTheme);

          sendGAEvent({
            event: "switch_dark_mode",
            value: newTheme,
          });

          // ログイン時はサーバーにテーマも保存
          if (userId) {
            startTransition(async () => {
              try {
                await updateUserPreference("theme", newTheme);
              } catch (error) {
                console.error("テーマ設定の保存に失敗しました:", error);
              }
            });
          }
        }}
        label="ダークモード"
        size="md"
        disabled={isPending}
      />
      <Switch
        checked={showWinthroughPopup}
        onChange={(event) => {
          updateSetting(
            setShowWinthroughPopup,
            "showWinthroughPopup",
            event.currentTarget.checked,
            "show_winthrough_popup"
          );
        }}
        label="勝ち抜け時にポップアップを表示"
        size="md"
        disabled={isPending}
      />
      <Switch
        checked={showBoardHeader}
        onChange={(event) => {
          updateSetting(
            setShowBoardHeader,
            "showBoardHeader",
            event.currentTarget.checked,
            "show_board_header"
          );
        }}
        label="ヘッダーを表示"
        size="md"
        disabled={isPending}
      />
      <Switch
        checked={showQn}
        onChange={(event) => {
          updateSetting(
            setShowQn,
            "showQn",
            event.currentTarget.checked,
            "show_qn"
          );
        }}
        label="ヘッダーに問題番号を表示"
        size="md"
        disabled={isPending}
      />
      <Switch
        checked={showSignString}
        onChange={(event) => {
          updateSetting(
            setShowSignString,
            "showSignString",
            event.currentTarget.checked,
            "show_sign_string"
          );
        }}
        label="スコアに「○」「✕」「pt」の文字列を付与する"
        size="md"
        disabled={isPending}
      />
      <Switch
        checked={reversePlayerInfo}
        onChange={(event) => {
          updateSetting(
            setReversePlayerInfo,
            "reversePlayerInfo",
            event.currentTarget.checked,
            "reverse_player_info"
          );
        }}
        label="スコアを名前の上に表示"
        size="md"
        disabled={isPending}
      />
      <Switch
        checked={wrongNumber}
        onChange={(event) => {
          updateSetting(
            setWrongNumber,
            "wrongNumber",
            event.currentTarget.checked,
            "wrong_number"
          );
        }}
        label="誤答数が4以下のとき✕の数で表示"
        description="誤答数が0のときは中黒・で表示されます。"
        size="md"
        disabled={isPending}
      />
    </Flex>
  );
};

export default ServerPreferences;
