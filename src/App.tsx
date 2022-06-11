import { ConversationList } from "@/components/ConversationList";
import { Menu } from "@/components/Menu";
import { ChatWindow } from "@/components/ChatWindow";
import { useMessenger } from "@/components/MessengerContext";
import { createEffect } from "solid-js";
const App = () => {
  const { chats, messages, sendMessage, currentCorrespondent } = useMessenger();

  return (
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
  );
};

export default App;
