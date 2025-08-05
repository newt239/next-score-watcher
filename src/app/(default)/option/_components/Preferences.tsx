"use client";

import {
  Flex,
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { sendGAEvent } from "@next/third-parties/google";

const Preferences: React.FC = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

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

  // 設定更新のヘルパー関数
  const updateSetting = <T,>(
    localSetter: (value: T) => void,
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
        }}
        label="ダークモード"
        size="md"
      />
      <Switch
        checked={showWinthroughPopup}
        onChange={(event) => {
          updateSetting(
            setShowWinthroughPopup,
            event.currentTarget.checked,
            "show_winthrough_popup"
          );
        }}
        label="勝ち抜け時にポップアップを表示"
        size="md"
      />
      <Switch
        checked={showBoardHeader}
        onChange={(event) => {
          updateSetting(
            setShowBoardHeader,
            event.currentTarget.checked,
            "show_board_header"
          );
        }}
        label="ヘッダーを表示"
        size="md"
      />
      <Switch
        checked={showQn}
        onChange={(event) => {
          updateSetting(setShowQn, event.currentTarget.checked, "show_qn");
        }}
        label="ヘッダーに問題番号を表示"
        size="md"
      />
      <Switch
        checked={showSignString}
        onChange={(event) => {
          updateSetting(
            setShowSignString,
            event.currentTarget.checked,
            "show_sign_string"
          );
        }}
        label="スコアに「○」「✕」「pt」の文字列を付与する"
        size="md"
      />
      <Switch
        checked={reversePlayerInfo}
        onChange={(event) => {
          updateSetting(
            setReversePlayerInfo,
            event.currentTarget.checked,
            "reverse_player_info"
          );
        }}
        label="スコアを名前の上に表示"
        size="md"
      />
      <Switch
        checked={wrongNumber}
        onChange={(event) => {
          updateSetting(
            setWrongNumber,
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

export default Preferences;
