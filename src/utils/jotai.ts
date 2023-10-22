import { atomWithStorage } from "jotai/utils";

export const showWinthroughPopupAtom = atomWithStorage(
  "scorew-show-winthrough-popup",
  true
);
export const showQnAtom = atomWithStorage("scorew-show-qn", true);
export const showSignStringAtom = atomWithStorage(
  "scorew-show-sign-string",
  true
);
export const reversePlayerInfoAtom = atomWithStorage(
  "scorew-reverse-player-info",
  false
);
export const verticalViewAtom = atomWithStorage("scorew-vertical-view", false);
export const wrongNumberAtom = atomWithStorage("scorew-wrong-number", false);
export const webhookUrlAtom = atomWithStorage("scorew-webhook-url", "");
