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
  const { currentUser, authenticate, createUser, status, resetOnAuthTokenExpired } =
    useAuthenctionContext();

  return (
    <Show
      when={currentUser() !== null}
      fallback={
        <Show
          when={status() === AUTH_STATUS.NON_AUTHENTICATED}
          fallback={
            <div class="fixes top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Spinner />
            </div>
          }
        >
          <Authentication createUser={createUser} authenticate={authenticate} />
        </Show>
      }
    >
     <MessengerContextProvider currentUser={currentUser} resetOnAuthTokenExpired={resetOnAuthTokenExpired} >
        <Messenger />
      </MessengerContextProvider>
    </Show>
  );
};

export default App;
