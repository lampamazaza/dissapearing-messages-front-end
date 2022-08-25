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
    const keyPair = localStorage.getItem(alias)
    if(keyPair === null) throw new Error("No such key stored in memory, please create a new profile.")
    return JSON.parse(keyPair);
}

export const keysStorageService = {
  saveKeyPair,
  getKeyPair,
};
