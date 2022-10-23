import { Message as MessageComponent } from "@/components/Message";
import { ControlPanel } from "@/components/ControlPanel";
import { UserPanel } from "@/components/UserPanel";
import { For, createEffect, on } from "solid-js";
import { Chat, User, Message } from "@/types/api";
import type { Accessor, Component } from "solid-js";
const dialogueContainer = "w"

export const ChatWindow: Component<{ currentUser: Accessor<User>, messages: Accessor<Message[]>, currentCorrespondent: Accessor<Chat>, sendMessage: (message: string) => Promise<void> }> = (props) => {
  createEffect(
    on(
      props.messages,
      () => {
        const element = document.getElementById(dialogueContainer);
        if (element) element.scrollTop = element.scrollHeight;
      },
      { defer: true }
    )
  );

  return (
    <div class="flex flex-col h-screen">
      <UserPanel name={props.currentCorrespondent().user.name} />
      <div
        id={dialogueContainer}
        style={{
          height: "calc(100vh - 140px)",
        }}
        class="bg-main flex flex-1 flex-col overflow-scroll bg-white border-gray-200 p-20 scrollbar-hide"
      >
        <For each={props.messages()}>
          {({ text, sender, sentAt }) => {
            const isMine = props.currentCorrespondent().publicKey !== sender;
            const name = isMine
              ? props.currentUser().name
              : props.currentCorrespondent().user.name;
            return <MessageComponent text={text} name={name} date={sentAt} isMine={isMine} />;
          }}
        </For>
      </div>
      <ControlPanel onSend={props.sendMessage} />
    </div>
  );
};
