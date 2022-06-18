import {
  createResource,
  createEffect,
  createContext,
  useContext,
  createSignal,
  onMount,
  batch,
} from "solid-js";
import {
  createUser
} from "./api";
import { keysStorageService }  from "@/services/keysStorageService"
import { generateKeyPair, publicKeyToBase64String, privateKeyToBase64String } from "@/services/cryptoService"

export const AuthenticationContext = createContext();

export function AuthenticationContextProvider(props) {

  async function tryCreateUser({ name, alias, password }:{ name: string, alias: string, password: string }) {
    const {publicKey, privateKey } = await generateKeyPair();
    const stringifiedPublicKey =  await publicKeyToBase64String(publicKey);
    const stringifiedPrivateKey =  await privateKeyToBase64String(privateKey);
    await createUser({ name, alias, publicKey: stringifiedPublicKey });
    keysStorageService.saveKeyPair(alias, {publicKey: stringifiedPublicKey, privateKey: stringifiedPrivateKey})
  }
  
  return (
    <AuthenticationContext.Provider
      value={{
        createUser: tryCreateUser
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenctionContext() {
  return useContext(AuthenticationContext);
}
