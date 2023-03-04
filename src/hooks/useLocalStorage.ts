export const getConfig = (key: string, defaultValue?: boolean) => {
  const value = localStorage.getItem(key);
  if (value === null) {
    if (defaultValue !== undefined) {
      localStorage.setItem(key, String(defaultValue));
      return defaultValue;
    } else {
      localStorage.setItem(key, "true");
      return true;
    }
  } else if (value === "true") {
    return true;
  }
  return false;
};

export const setConfig = (key: string, value: boolean) => {
  localStorage.setItem(key, String(value));
};
