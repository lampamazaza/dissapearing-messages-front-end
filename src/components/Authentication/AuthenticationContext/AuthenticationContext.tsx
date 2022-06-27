import { createContext, useContext, createSignal } from "solid-js";
import { createUser, getAuthenticationData, authenticate } from "./api";
import { keysStorageService } from "@/services/keysStorageService";
import {
  generateKeyPair,
  keyToPortable,
  encodePrivateKey,
  decodePrivateKey,
  deriveBackEndKey,
  decryptBackEndMessage,
  deriveSecretKey,
} from "@/services/cryptoServiceECDH";
import type { Signal, Accessor, Setter } from "solid-js";
import { User } from "@/types/api";

export const AuthenticationContext = createContext<{
  createUser: ({
    name,
    alias,
    password,
  }: {
    alias: string;
    name: string;
    password: string;
  }) => Promise<User>;
  authenticate: ({
    alias,
    password,
  }: {
    alias: string;
    password: string;
  }) => Promise<{
    accessToken: string;
    user: User;
  }>;
  accessToken: Accessor<string>;
}>();

export function AuthenticationContextProvider(props) {
  const [accessToken, setAccessToken] = createSignal(null);

  async function tryCreateUser({
    name,
    alias,
    password,
  }: {
    alias: string;
    name: string;
    password: string;
  }): Promise<User> {
    const { publicKey, privateKey } = await generateKeyPair();
    const portableFormatPublicKey = await keyToPortable(publicKey);
    const createdUser = await createUser({
      name,
      alias,
      publicKey: portableFormatPublicKey,
    });
    keysStorageService.saveKeyPair(alias, {
      publicKey: portableFormatPublicKey,
      encryptedPrivateKey: await encodePrivateKey(privateKey, password),
    });
    return createdUser as User;
  }

  async function tryAuthenticate({
    alias,
    password,
  }: {
    alias: string;
    password: string;
  }) {
    const existingToken = accessToken();
    if (existingToken) return existingToken;
    // get keypair from localstorage
    const { publicKey, encryptedPrivateKey } =
      keysStorageService.getKeyPair(alias);
    // decryptPrivateKey which is JWK that is used for importing the key
    const myPrivateKey = await decodePrivateKey(encryptedPrivateKey, password);

    // Ask back end for salt, encrypted msg, and public key
    const {
      iv,
      msg,
      publicKey: rawBackEndPublicKey,
    } = await getAuthenticationData(publicKey);
    // create a back end public key from jwk
    const backEndPublicKey = await deriveBackEndKey(rawBackEndPublicKey);
    // derive secret
    const mySharedSecret = await deriveSecretKey(
      myPrivateKey,
      backEndPublicKey
    );
    // decrypt msg
    const decryptedMsg = await decryptBackEndMessage(mySharedSecret, msg, iv);
    // // ask BackEnd to check if msg is the same as it was encrypted
    const { accessToken: freshToken, user } = await authenticate(
      decryptedMsg,
      publicKey
    );
    // if is authed back end returs jwt accesstoken
    if (freshToken) {
      setAccessToken(freshToken);
    }
    return {
      accessToken: freshToken,
      user,
    };
  }

  return (
    <AuthenticationContext.Provider
      value={{
        createUser: tryCreateUser,
        authenticate: tryAuthenticate,
        accessToken,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenctionContext() {
  return useContext(AuthenticationContext);
}
