export const CURRENT_PROFILE_STORAGE_KEY = "scorew_current_profile";
export const DEFAULT_CURRENT_PROFILE = "score_watcher";

/**
 * Local Storageから現在のプロファイルIDを取得する
 */
export const getStoredCurrentProfile = (): string => {
  if (typeof window === "undefined") {
    return DEFAULT_CURRENT_PROFILE;
  }

  return window.localStorage.getItem(CURRENT_PROFILE_STORAGE_KEY) || DEFAULT_CURRENT_PROFILE;
};

/**
 * 現在のプロファイルIDをLocal Storageに保存する
 */
export const setStoredCurrentProfile = (profileId: string): void => {
  window.localStorage.setItem(CURRENT_PROFILE_STORAGE_KEY, profileId);
};
