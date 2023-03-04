import { atomWithStorage } from "jotai/utils";

export const showWinthroughPopupAtom = atomWithStorage(
  "scorew-show-winthrough-popup",
  true
);
export const showLogsAtom = atomWithStorage("scorew-show-logs", true);
export const showSignStringAtom = atomWithStorage(
  "scorew-show-sign-string",
  true
);
export const reversePlayerInfoAtom = atomWithStorage(
  "scorew-reverse-player-info",
  false
);
export const verticalViewAtom = atomWithStorage("scorew-vertical-view", false);
