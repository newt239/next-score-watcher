"use client";

import {
  Flex,
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

const Preferences = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  const [showWinthroughPopup, setShowWinthroughPopup] = useLocalStorage({
    key: "showWinthroughPopup",
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

  return (
    <Flex direction="column" gap="lg" mb="lg">
      <Switch
        checked={computedColorScheme === "dark"}
        onChange={() =>
          setColorScheme(computedColorScheme === "dark" ? "light" : "dark")
        }
        label="ダークモード"
        size="md"
      />
      <Switch
        checked={showWinthroughPopup}
        onChange={() => setShowWinthroughPopup((v) => !v)}
        label="勝ち抜け時にポップアップを表示"
        size="md"
      />
      <Switch
        checked={showQn}
        onChange={() => setShowQn((v) => !v)}
        label="ヘッダーに問題番号を表示"
        size="md"
      />
      <Switch
        checked={showSignString}
        onChange={() => setShowSignString((v) => !v)}
        label="スコアに「○」「✕」「pt」の文字列を付与する"
        size="md"
      />
      <Switch
        checked={reversePlayerInfo}
        onChange={() => setReversePlayerInfo((v) => !v)}
        label="スコアを名前の上に表示"
        size="md"
      />
      <Switch
        checked={wrongNumber}
        onChange={() => setWrongNumber((v) => !v)}
        label="誤答数が4以下のとき✕の数で表示"
        description="誤答数が0のときは中黒・で表示されます。"
        size="md"
      />
    </Flex>
  );
};

export default Preferences;
