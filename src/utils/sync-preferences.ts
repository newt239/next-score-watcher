import { getUserPreferences } from "@/app/(default)/user/_actions/preferences";

/**
 * ログイン時にサーバーの設定をlocalStorageと同期する
 */
export async function syncPreferencesFromServer(): Promise<void> {
  try {
    const serverPreferences = await getUserPreferences();

    if (serverPreferences) {
      // 表示設定を同期
      localStorage.setItem(
        "showWinthroughPopup",
        JSON.stringify(serverPreferences.showWinthroughPopup)
      );
      localStorage.setItem(
        "showBoardHeader",
        JSON.stringify(serverPreferences.showBoardHeader)
      );
      localStorage.setItem("showQn", JSON.stringify(serverPreferences.showQn));
      localStorage.setItem(
        "showSignString",
        JSON.stringify(serverPreferences.showSignString)
      );
      localStorage.setItem(
        "reversePlayerInfo",
        JSON.stringify(serverPreferences.reversePlayerInfo)
      );
      localStorage.setItem(
        "wrongNumber",
        JSON.stringify(serverPreferences.wrongNumber)
      );

      // Webhook設定を同期
      if (serverPreferences.webhookUrl) {
        localStorage.setItem(
          "scorew-webhook-url",
          serverPreferences.webhookUrl
        );
      }

      console.log("サーバーの設定をlocalStorageに同期しました");
    }
  } catch (error) {
    console.error("設定の同期に失敗しました:", error);
  }
}

/**
 * localStorageの設定をサーバーに同期する
 * （ログイン時にlocalStorageの設定をサーバーに反映したい場合）
 */
export function getLocalPreferences() {
  try {
    return {
      showWinthroughPopup: JSON.parse(
        localStorage.getItem("showWinthroughPopup") || "true"
      ),
      showBoardHeader: JSON.parse(
        localStorage.getItem("showBoardHeader") || "true"
      ),
      showQn: JSON.parse(localStorage.getItem("showQn") || "false"),
      showSignString: JSON.parse(
        localStorage.getItem("showSignString") || "true"
      ),
      reversePlayerInfo: JSON.parse(
        localStorage.getItem("reversePlayerInfo") || "false"
      ),
      wrongNumber: JSON.parse(localStorage.getItem("wrongNumber") || "true"),
      webhookUrl: localStorage.getItem("scorew-webhook-url") || null,
    };
  } catch (error) {
    console.error("localStorage設定の読み込みに失敗しました:", error);
    return null;
  }
}
