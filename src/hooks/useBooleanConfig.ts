export const getConfig = (key: string, defaultValue?: boolean) => {
  const value = localStorage.getItem(key);
  if (value === null) {
    localStorage.setItem(key, String(defaultValue || "true"));
    return defaultValue || true;
  } else if (value === "true") {
    return true;
  }
  return false;
};

export const setConfig = (key: string, value: boolean) => {
  localStorage.setItem(key, String(value));
};