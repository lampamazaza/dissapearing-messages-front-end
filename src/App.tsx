import { ConversationList } from "@/components/ConversationList";
import { Menu } from "@/components/Menu";
import { ChatWindow } from "@/components/ChatWindow";
import { useMessenger } from "@/components/MessengerContext";
import { Show } from "solid-js";
import { Authentication } from "@/components/Authentication";
import {
  useAuthenctionContext,
  AUTH_STATUS,
} from "./components/Authentication/AuthenticationContext/AuthenticationContext";
import { Spinner } from "./components/Spinner";

const App = () => {
  const { chats, messages, sendMessage, currentCorrespondent } = useMessenger();
  const { currentUser, authenticate, createUser, status, logout } =
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
      <div class="grid grid-cols-desktop grid-rows-desktop">
        <Menu>
          <ConversationList
            chats={chats}
            currentUser={currentUser}
            currentCorrespondent={currentCorrespondent}
            logout={logout}
          />
        </Menu>
        <div class="bg-chat">
          {currentCorrespondent() && (
            <ChatWindow
              messages={messages}
              currentCorrespondent={currentCorrespondent}
              currentUser={currentUser}
              sendMessage={sendMessage}
            />
          )}
        </div>
      </div>
    </Show>
  );
};

export default App;
