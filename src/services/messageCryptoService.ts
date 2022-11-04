import { box, randomBytes } from "tweetnacl";
import { decodeUTF8, encodeUTF8 } from "tweetnacl-util";
import { base58_to_binary, binary_to_base58 } from "base58-js";

export interface IMessageEncryptionService {
  encrypt: (message: string, recipientPublicKey: string) => string;
  decrypt: (message: string, senderPublicKey: string) => string;
}

type publicKey = string;
type SecretOrSharedKey = Uint8Array;

export function initMessageCryptoService({
  currentUserPrivateKey,
}: {
  currentUserPrivateKey: Uint8Array;
}): IMessageEncryptionService {
  const correpondetsMap: Record<publicKey, SecretOrSharedKey> = {};

  function encrypt(messageToEncrypt: string, secretOrSharedKey: Uint8Array) {
    const nonce = randomBytes(box.nonceLength);
    const messageUint8 = decodeUTF8(messageToEncrypt);
    const encrypted = box.after(messageUint8, nonce, secretOrSharedKey);

    const fullMessage = new Uint8Array(nonce.length + encrypted.length);
    fullMessage.set(nonce);
    fullMessage.set(encrypted, nonce.length);

    const base58FullMessage = binary_to_base58(fullMessage);
    return base58FullMessage;
  }

  function decrypt(messageToDecrypt: string, secretOrSharedKey: Uint8Array) {
    const messageWithNonceAsUint8Array = base58_to_binary(messageToDecrypt);
    const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(
      box.nonceLength,
      messageToDecrypt.length
    );

    const decrypted = box.open.after(message, nonce, secretOrSharedKey);

    if (!decrypted) {
      throw new Error("Could not decrypt message");
    }

    return encodeUTF8(decrypted);
  }

  function sharedKey(
    publicKey: publicKey,
    currentUserPrivateKey: Uint8Array
  ): SecretOrSharedKey {
    let secretKey = correpondetsMap[publicKey];
    if (secretKey !== undefined) return secretKey;
    secretKey = box.before(base58_to_binary(publicKey), currentUserPrivateKey);
    correpondetsMap[publicKey] = secretKey;
    return secretKey;
  }

  return {
    encrypt: (message: string, recipientPublicKey: string) =>
      encrypt(message, sharedKey(recipientPublicKey, currentUserPrivateKey)),
    decrypt: (message: string, senderPublicKey: string) =>
      decrypt(message, sharedKey(senderPublicKey, currentUserPrivateKey)),
  };
}
