function saveKeyPair(
  alias: string,
  payload: { publicKey: string; encryptedPrivateKey: string }
) {
  localStorage.setItem(alias, JSON.stringify(payload));
}

function getKeyPair(alias: string): {
  publicKey: string;
  encryptedPrivateKey: string;
} {
  return JSON.parse(localStorage.getItem(alias));
}

export const keysStorageService = {
  saveKeyPair,
  getKeyPair,
};
