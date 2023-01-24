export const getItem = (key: string) => {
  const value = localStorage.getItem(key);
  if (value !== null) {
    return value;
  }
  return "";
};

export const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
