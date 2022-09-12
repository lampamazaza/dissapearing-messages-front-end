import { box,secretbox, hash, randomBytes } from 'tweetnacl';
import { binary_to_base58 } from 'base58-js'
import {
  decodeUTF8,
  encodeBase64,
  decodeBase64,
} from "tweetnacl-util";


export  function generateKeyPair(): {
  publicKey: Uint8Array,
  privateKey: Uint8Array
} {
  const { publicKey, secretKey } =  box.keyPair()
  return {
    publicKey,
    privateKey: secretKey
  }
}

export  function keyToPortable(key: Uint8Array) {
  return binary_to_base58(key)
}

function generatePasswordBasedKey(password: string) {
  const passwordHash = hash(decodeUTF8(password))
  return passwordHash.slice(0,secretbox.keyLength)
}

function newNonce () {return randomBytes(secretbox.nonceLength);}

export function encodePrivateKey(privateKey: Uint8Array, password: string): string {
  const keyUint8Array = generatePasswordBasedKey(password)

  const nonce = newNonce();
  const messageUint8 = privateKey;
  const box = secretbox(messageUint8, nonce, keyUint8Array);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
}


export function decodePrivateKey(
  portableBase64PrivateKey: string,
  password
): Uint8Array {
  const keyUint8Array = generatePasswordBasedKey(password)

  const messageWithNonceAsUint8Array = decodeBase64(portableBase64PrivateKey);
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


export function decryptBackEndMessage(
  {
    msg,
    publicKeyFromBackEnd,
    clientPrivateKey
  }: {
    msg: string
    publicKeyFromBackEnd: string
    clientPrivateKey: Uint8Array
  }
): string {
  const clientSharedKey = box.before(decodeBase64(publicKeyFromBackEnd), clientPrivateKey);

  const messageWithNonceAsUint8Array = decodeBase64(msg);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonceAsUint8Array.length
  );

  const decrypted = box.open.after(message, nonce, clientSharedKey);

  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }

  return encodeBase64(decrypted);
}

