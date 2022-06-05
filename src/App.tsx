import { ConversationList } from "@/components/ConversationList";
import { Menu } from "@/components/Menu";
import { ChatWindow } from "@/components/ChatWindow";
import { useMessenger } from "@/components/MessengerContext";
const App = () => {
  const { chats, messages, currentCorrespondent, sendMessage } = useMessenger();
  return (
    <div class="grid grid-cols-desktop grid-rows-desktop">
      <Menu>
        <ConversationList chats={chats} />
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
