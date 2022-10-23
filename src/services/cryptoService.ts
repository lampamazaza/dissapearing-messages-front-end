import { box, secretbox, hash, randomBytes } from "tweetnacl";
import { binary_to_base58, base58_to_binary } from "base58-js";
import { decodeUTF8 } from "tweetnacl-util";

export function generateKeyPair(): {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
} {
  const { publicKey, secretKey } = box.keyPair();
  return {
    publicKey,
    privateKey: secretKey,
  };
}

export function keyToPortable(key: Uint8Array) {
  return binary_to_base58(key);
}

function generatePasswordBasedKey(passcode: string) {
  const passcodeHash = hash(decodeUTF8(passcode));
  return passcodeHash.slice(0, secretbox.keyLength);
}

export function encodePrivateKey(
  privateKey: Uint8Array,
  passcode: string
): string {
  const keyUint8Array = generatePasswordBasedKey(passcode);

  const nonce = randomBytes(secretbox.nonceLength);
  const messageUint8 = privateKey;
  const box = secretbox(messageUint8, nonce, keyUint8Array);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  const base58FullMessage = binary_to_base58(fullMessage);
  return base58FullMessage;
}

export function decodePrivateKey(
  portableBase64PrivateKey: string,
  passcode
): Uint8Array {
  const keyUint8Array = generatePasswordBasedKey(passcode);

  const messageWithNonceAsUint8Array = base58_to_binary(
    portableBase64PrivateKey
  );
  const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    secretbox.nonceLength,
    messageWithNonceAsUint8Array.length
  );

  const decrypted = secretbox.open(message, nonce, keyUint8Array);

  if (!decrypted) {
    throw new Error("Could not decrypt private key");
  }

  return decrypted;
}

export function decryptBackEndMessage({
  msg,
  publicKeyFromBackEnd,
  clientPrivateKey,
}: {
  msg: string;
  publicKeyFromBackEnd: string;
  clientPrivateKey: Uint8Array;
}): string {
  const clientSharedKey = box.before(
    base58_to_binary(publicKeyFromBackEnd),
    clientPrivateKey
  );

  const messageWithNonceAsUint8Array = base58_to_binary(msg);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonceAsUint8Array.length
  );

  const decrypted = box.open.after(message, nonce, clientSharedKey);

  if (!decrypted) {
    throw new Error("Could not decrypt message");
  }

  return binary_to_base58(decrypted);
}
