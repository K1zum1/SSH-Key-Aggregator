const STORAGE_KEY = 'sshKeys';

export const saveToLocalStorage = (keys) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
};

export const loadFromLocalStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
