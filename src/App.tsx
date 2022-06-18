import { ConversationList } from "@/components/ConversationList";
import { Menu } from "@/components/Menu";
import { ChatWindow } from "@/components/ChatWindow";
import { useMessenger } from "@/components/MessengerContext";
import { createEffect } from "solid-js";
import { Authentication } from "@/components/Authentication";
import { AuthenticationContextProvider } from "./components/Authentication/AuthenticationContext/AuthenticationContext";

const App = () => {
  const { chats, messages, sendMessage, currentCorrespondent, currentUser } =
    useMessenger();

  return currentUser() ? (
    <div class="grid grid-cols-desktop grid-rows-desktop">
      <Menu>
        <ConversationList
          chats={chats}
          currentCorrespondent={currentCorrespondent}
        />
      </Menu>
      {currentCorrespondent() && (
        <ChatWindow
          messages={messages}
          currentCorrespondent={currentCorrespondent}
          sendMessage={sendMessage}
        />
      )}
    </div>
  ) : (
    <AuthenticationContextProvider>
      <Authentication />
    </AuthenticationContextProvider>
  );
};

export default App;
