export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["sign"] //can be any combination of "sign" and "verify"
  );
}

export async function sign(
  privateKey: CryptoKey,
  data: ArrayBuffer
): Promise<ArrayBuffer> {
  return window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    privateKey, //from generateKey or importKey above
    data //ArrayBuffer of data you want to sign
  );
}

export async function publicKeyToBase64String(publicKey: CryptoKey) {
  const rawPublicKey = await window.crypto.subtle.exportKey("raw", publicKey)
  return window.btoa(String.fromCharCode(...new Uint8Array(rawPublicKey)))
}

export async function privateKeyToBase64String(privateKey: CryptoKey) {
  const rawPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey)
  return window.btoa(String.fromCharCode(...new Uint8Array(rawPrivateKey)))
}

export async function encodePrivateKey() {

}
