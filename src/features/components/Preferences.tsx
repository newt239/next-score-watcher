import { useColorMode } from "@chakra-ui/react";
import { useAtom } from "jotai";

import AppOptionSwitch from "~/components/AppOptionSwitch";
import {
  reversePlayerInfoAtom,
  showQnAtom,
  showSignStringAtom,
  showWinthroughPopupAtom,
  wrongNumberAtom,
} from "~/utils/jotai";

const Preferences = () => {
  const [showWinthroughPopup, showSetWinthroughPopup] = useAtom(
    showWinthroughPopupAtom
  );
  const [showQn, setShowQn] = useAtom(showQnAtom);
  const [showSignString, setShowSignString] = useAtom(showSignStringAtom);
  const [reversePlayerInfo, setReversePlayerInfo] = useAtom(
    reversePlayerInfoAtom
  );
  const [wrongNumber, setWrongNumber] = useAtom(wrongNumberAtom);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <AppOptionSwitch
        isChecked={colorMode === "dark"}
        onChange={() => toggleColorMode()}
        title="ダークモード"
      />
      <AppOptionSwitch
        isChecked={showWinthroughPopup}
        onChange={() => showSetWinthroughPopup((v) => !v)}
        title="勝ち抜け時にポップアップを表示"
      />
      <AppOptionSwitch
        isChecked={showQn}
        onChange={() => setShowQn((v) => !v)}
        title="ヘッダーに問題番号を表示"
      />
      <AppOptionSwitch
        isChecked={showSignString}
        onChange={() => setShowSignString((v) => !v)}
        title="スコアに「○」「✕」「pt」の文字列を付与する"
      />
      <AppOptionSwitch
        isChecked={reversePlayerInfo}
        onChange={() => setReversePlayerInfo((v) => !v)}
        title="スコアを名前の上に表示"
      />
      <AppOptionSwitch
        isChecked={wrongNumber}
        label="誤答数が0のときは中黒・で表示されます。"
        onChange={() => setWrongNumber((v) => !v)}
        title="誤答数が4以下のとき✕の数で表示"
      />
    </>
  );
};

export default Preferences;
