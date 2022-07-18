import { ConversationList } from "@/components/ConversationList";
import { Menu } from "@/components/Menu";
import { ChatWindow } from "@/components/ChatWindow";
import { useMessenger } from "@/components/MessengerContext";
import {
  useAuthenctionContext,
} from "../Authentication/AuthenticationContext/AuthenticationContext";

export const Messenger = () => {
  const { chats, messages, sendMessage, currentCorrespondent } = useMessenger();
  const { currentUser, logout } =
    useAuthenctionContext();

  return (

      <div
        class={`grid h-screen overflow-hidden grid-cols-1 grid-rows-mobile d:grid-cols-desktop d:grid-rows-desktop`}
      >
        <div
          class={`${
            currentCorrespondent() ? "order-2" : "order-1"
          } d:order-none`}
        >
          <Menu>
            <ConversationList
              chats={chats}
              currentUser={currentUser}
              currentCorrespondent={currentCorrespondent}
              logout={logout}
            />
          </Menu>
        </div>
        <div
          class={`${
            currentCorrespondent() ? "order-1" : "order-2"
          } d:order-none`}
        >
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
  );
};

