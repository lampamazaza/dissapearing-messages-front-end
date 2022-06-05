export function getCurrentHashValue() {
  const hash = window.location.hash;
  if (!hash) return "";
  return hash.slice(1);
}

export function normalizeByKey(arr, key) {
  return arr.reduce((acc, item) => {
    const keyValue = item[key];
    acc[keyValue] = item;
    return acc;
  }, {});
}

export function findUserInChats(arr, publicKey) {
  return arr.find((chat) => chat.user.publicKey === publicKey);
}
