export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

export async function keyToPortable(key) {
  const jwk = await window.crypto.subtle.exportKey(
    "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
    key //can be a publicKey or privateKey, as long as extractable was true
  );

  const encoded = new TextEncoder().encode(JSON.stringify(jwk));

  return window.btoa(String.fromCharCode(...encoded));
}

async function initDataBasedOnPassword(password) {
  const encodedPassword = new TextEncoder().encode(password);

  const hashedPassword = await crypto.subtle.digest("SHA-256", encodedPassword);

  const importedKey = window.crypto.subtle.importKey(
    "raw",
    encodedPassword,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  return {
    salt: new Uint8Array(hashedPassword.slice(0, 16)),
    initVector: new Uint8Array(hashedPassword.slice(16, 32)),
    importedKey: await importedKey,
  };
}

export async function encodePrivateKey(privateKey, password) {
  const encoder = new TextEncoder();
  const { importedKey, salt, initVector } = await initDataBasedOnPassword(
    password
  );

  const contentToEncrypt = encoder.encode(
    JSON.stringify(
      await window.crypto.subtle.exportKey(
        "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        privateKey //can be a publicKey or privateKey, as long as extractable was true
      )
    )
  );

  console.log(privateKey);
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    importedKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const encryptedKey = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: initVector,
    },
    key,
    contentToEncrypt
  );

  return window.btoa(String.fromCharCode(...new Uint8Array(encryptedKey)));
}

export async function decryptJwkKey(encryptedJwkKey, password) {
  const { importedKey, salt, initVector } = await initDataBasedOnPassword(
    password
  );

  const binaryEncryptedJwkKey = Uint8Array.from(
    window.atob(encryptedJwkKey),
    (c) => c.charCodeAt(0)
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    importedKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: initVector,
    },
    key,
    binaryEncryptedJwkKey
  );
  const decoder = new TextDecoder();

  return JSON.parse(decoder.decode(decrypted));
}

export async function decodePublicKey(portableBase64: string) {
  const binaryPortableBase64Key = Uint8Array.from(
    window.atob(portableBase64),
    (c) => c.charCodeAt(0)
  );

  const { kty, crv, x, y, d, ext, key_ops } = JSON.parse(
    new TextDecoder().decode(binaryPortableBase64Key)
  );

  return window.crypto.subtle.importKey(
    "jwk", //can be "jwk" (public or private), "raw" (public only), "spki" (public only), or "pkcs8" (private only)
    { kty, crv, x, y, ext, key_ops },
    {
      //these are the algorithm options
      name: "ECDH",
      namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    key_ops //"deriveKey" and/or "deriveBits" for private keys only (just put an empty list if importing a public key)
  );
}
export async function decodePrivateKey(
  portableBase64PrivateKey: string,
  password
) {
  const { kty, crv, x, y, d, ext, key_ops } = await decryptJwkKey(
    portableBase64PrivateKey,
    password
  );

  return window.crypto.subtle.importKey(
    "jwk", //can be "jwk" (public or private), "raw" (public only), "spki" (public only), or "pkcs8" (private only)
    { kty, crv, x, y, ext, d, key_ops },
    {
      //these are the algorithm options
      name: "ECDH",
      namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    key_ops //"deriveKey" and/or "deriveBits" for private keys only (just put an empty list if importing a public key)
  );
}
export async function deriveBackEndKey(jwkKey: Uint8Array) {
  const { kty, crv, x, y, ext, key_ops } = JSON.parse(
    new TextDecoder().decode(jwkKey)
  );
  return window.crypto.subtle.importKey(
    "jwk", //can be "jwk" (public or private), "raw" (public only), "spki" (public only), or "pkcs8" (private only)
    { kty, crv, x, y, ext, key_ops },
    {
      //these are the algorithm options
      name: "ECDH",
      namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    key_ops //"deriveKey" and/or "deriveBits" for private keys only (just put an empty list if importing a public key)
  );
}

export async function decryptBackEndMessage(
  key: CryptoKey,
  message: Uint8Array,
  iv: Uint8Array
) {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    message
  );

  return new Uint8Array(decrypted);
}

export function deriveSecretKey(privateKey, publicKey) {
  return window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey,
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}
