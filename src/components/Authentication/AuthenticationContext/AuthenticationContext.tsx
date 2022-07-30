import {
  createContext,
  useContext,
  createSignal,
  onMount,
  batch,
} from "solid-js";
import {
  createUser,
  getAuthenticationData,
  authenticate,
  login,
  logout,
} from "./api";
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
import type { Accessor, Setter } from "solid-js";
import { User } from "@/types/api";
import baton from "@/services/baton";

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
    user: User;
  }>;
  logout: () => Promise<void>;
  resetOnAuthTokenExpired: () => void;
  setCurrentUser: Setter<{
    alias: string;
    name: string;
    password: string;
  } | null>;
  currentUser: Accessor<User | null>;
  status: Accessor<AUTH_STATUS>;
}>();

export enum AUTH_STATUS {
  TRYING_TO_AUTHENTICATE,
  AUTHENTICATED,
  NON_AUTHENTICATED,
}

export function AuthenticationContextProvider(props) {
  const [currentUser, setCurrentUser] = createSignal(null);
  const [authenticationStatus, setAuthenticationStatus] =
    createSignal<AUTH_STATUS>(AUTH_STATUS.TRYING_TO_AUTHENTICATE);
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

  onMount(async () => {
    try {
      const user = await login();
      if (user) {
        batch(() => {
          setCurrentUser(user);
          setAuthenticationStatus(AUTH_STATUS.AUTHENTICATED);
        });
      } else {
        setAuthenticationStatus(AUTH_STATUS.NON_AUTHENTICATED);
      }
    } catch (error) {
      console.error(error.message);
      setAuthenticationStatus(AUTH_STATUS.NON_AUTHENTICATED);
    }
  });

  async function tryAuthenticate({
    alias,
    password,
  }: {
    alias: string;
    password: string;
  }) {
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
    const { user } = await authenticate(decryptedMsg, publicKey);

    setCurrentUser(user);
    return {
      user,
    };
  }

  const trylogout = async () => {
    try {
      await logout();
      batch(() => {
        setCurrentUser(null);
        setAuthenticationStatus(AUTH_STATUS.NON_AUTHENTICATED);
      });
    } catch (error) {
      console.error(error);
      baton.error(error.message);
    }
  };

  const resetOnAuthTokenExpired = async () => {
    batch(() => {
      setCurrentUser(null);
      setAuthenticationStatus(AUTH_STATUS.NON_AUTHENTICATED);
    });
    baton.error("Please relogin again");
  };

  return (
    <AuthenticationContext.Provider
      value={{
        createUser: tryCreateUser,
        authenticate: tryAuthenticate,
        setCurrentUser,
        currentUser,
        status: authenticationStatus,
        logout: trylogout,
        resetOnAuthTokenExpired,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenctionContext() {
  return useContext(AuthenticationContext);
}
