function saveKeyPair(alias: string,payload: { publicKey: string, privateKey: string}) {
  localStorage.setItem(alias, JSON.stringify(payload)) 
}

function getKeyPair(publicKey: string): { publicKey: string, privateKey: string} {
  return JSON.parse(localStorage.getItem(publicKey)) 
}


export const keysStorageService = {
  saveKeyPair,
  getKeyPair
}
