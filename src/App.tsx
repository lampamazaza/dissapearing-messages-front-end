import { ConversationList } from "@/components/ConversationList";
import { Menu } from "@/components/Menu";
import { ChatWindow } from "@/components/ChatWindow";
import { useMessenger } from "@/components/MessengerContext";
import { Show } from "solid-js";
import { Authentication } from "@/components/Authentication";

const App = () => {
  const { chats, messages, sendMessage, currentCorrespondent, currentUser } =
    useMessenger();

  return (
    <Show when={currentUser() !== null} fallback={<Authentication />}>
      <div class="grid grid-cols-desktop grid-rows-desktop">
        <Menu>
          <ConversationList
            chats={chats}
            currentUser={currentUser}
            currentCorrespondent={currentCorrespondent}
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
