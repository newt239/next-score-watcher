import { Stack, useColorMode } from "@chakra-ui/react";
import { useAtom } from "jotai";

import AppOptionSwitch from "#/components/AppOptionSwitch";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import {
  reversePlayerInfoAtom,
  showLogsAtom,
  showSignStringAtom,
  showWinthroughPopupAtom,
  verticalViewAtom,
  wrongNumberAtom,
} from "#/utils/jotai";

const Preferences = () => {
  const desktop = useDeviceWidth();

  const [showWinthroughPopup, showSetWinthroughPopup] = useAtom(
    showWinthroughPopupAtom
  );
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);
  const [showSignString, setShowSignString] = useAtom(showSignStringAtom);
  const [reversePlayerInfo, setReversePlayerInfo] = useAtom(
    reversePlayerInfoAtom
  );
  const [verticalView, setVerticalView] = useAtom(verticalViewAtom);
  const [wrongNumber, setWrongNumber] = useAtom(wrongNumberAtom);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Stack sx={{ gap: 5, pt: 5 }}>
      <AppOptionSwitch
        title="ダークモード"
        isChecked={colorMode === "dark"}
        onChange={() => toggleColorMode()}
      />
      <AppOptionSwitch
        title="勝ち抜け時にポップアップを表示"
        isChecked={showWinthroughPopup}
        onChange={() => showSetWinthroughPopup((v) => !v)}
      />
      <AppOptionSwitch
        title="スコアに「○」「✕」「pt」の文字列を付与する"
        isChecked={showSignString}
        onChange={() => setShowSignString((v) => !v)}
      />
      <AppOptionSwitch
        title="得点表示画面下にログを表示"
        isChecked={showLogs}
        onChange={() => setShowLogs((v) => !v)}
      />
      <AppOptionSwitch
        title={`スコアを名前の${desktop && !verticalView ? "上" : "左"}に表示`}
        isChecked={reversePlayerInfo}
        onChange={() => setReversePlayerInfo((v) => !v)}
      />
      {desktop && (
        <AppOptionSwitch
          title="プレイヤーを垂直に並べる"
          isChecked={verticalView}
          onChange={() => setVerticalView((v) => !v)}
        />
      )}
      <AppOptionSwitch
        title="誤答数が4以下のとき✕の数で表示"
        label="誤答数が0のときは中黒・で表示されます。"
        isChecked={wrongNumber}
        onChange={() => setWrongNumber((v) => !v)}
      />
    </Stack>
  );
};

export default Preferences;
