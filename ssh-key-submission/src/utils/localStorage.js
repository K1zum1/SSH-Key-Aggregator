export const saveToLocalStorage = (keys) => {
  localStorage.setItem('sshKeys', JSON.stringify(keys));
};

export const loadFromLocalStorage = () => {
  const storedKeys = localStorage.getItem('sshKeys');
  return storedKeys ? JSON.parse(storedKeys) : [];
};
