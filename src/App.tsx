import { Show } from "solid-js";
import { Authentication } from "@/components/Authentication";
import {
  useAuthenctionContext,
  AUTH_STATUS,
} from "./components/Authentication/AuthenticationContext/AuthenticationContext";
import { Spinner } from "./components/Spinner";
import { Messenger } from "./components/Messenger";
import { MessengerContextProvider } from "./components/MessengerContext/MessengerContext";

const App = () => {
  const {
    currentUser,
    authenticate,
    createUser,
    status,
    privateKey,
    resetOnAuthTokenExpired,
    unlockWithPasscode,
  } = useAuthenctionContext();

  return (
    <Show
      when={status() === AUTH_STATUS.AUTHENTICATED}
      fallback={
        <Show
          when={status() !== AUTH_STATUS.TRYING_TO_AUTHENTICATE}
          fallback={
            <div class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Spinner />
            </div>
          }
        >
          <Authentication
            createUser={createUser}
            authenticate={authenticate}
            unlockWithPasscode={unlockWithPasscode}
            needToUnlockOnly={currentUser() !== null}
          />
        </Show>
      }
    >
      <MessengerContextProvider
        currentUser={currentUser}
        privateKey={privateKey}
        resetOnAuthTokenExpired={resetOnAuthTokenExpired}
      >
        <Messenger />
      </MessengerContextProvider>
    </Show>
  );
};

export default App;
