export const CURRENT_PROFILE_STORAGE_KEY = "scorew_current_profile";
export const PROFILE_LIST_STORAGE_KEY = "scorew_profile_list";
export const DEFAULT_CURRENT_PROFILE = "score_watcher";

export type ProfileListItem = { id: string; name: string };

/**
 * Local Storageから現在のプロファイルIDを取得する
 */
export const getStoredCurrentProfile = (): string => {
  if (typeof window === "undefined") {
    return DEFAULT_CURRENT_PROFILE;
  }

  const raw = window.localStorage.getItem(CURRENT_PROFILE_STORAGE_KEY);
  if (!raw) return DEFAULT_CURRENT_PROFILE;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : raw;
  } catch {
    return raw;
  }
};

/**
 * 現在のプロファイルIDをLocal Storageに保存する
 */
export const setStoredCurrentProfile = (profileId: string): void => {
  window.localStorage.setItem(CURRENT_PROFILE_STORAGE_KEY, JSON.stringify(profileId));
};
