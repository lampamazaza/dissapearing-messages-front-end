import { Message } from "@/components/Message";
import { ControlPanel } from "@/components/ControlPanel";
import { UserPanel } from "@/components/UserPanel";
import { For, createSignal, createEffect, on } from "solid-js";

export const ChatWindow = (props) => {
  createEffect(
    on(
      props.messages,
      () => {
        const element = document.getElementById("test");
        if (element) element.scrollTop = element.scrollHeight;
      },
      { defer: true }
    )
  );

  return (
    <div class="flex flex-col h-[100vh]">
      <UserPanel name={props.currentCorrespondent().user.name} />
      <div
        id="test"
        style={{
          height: "calc(100vh - 140px)",
        }}
        class="flex flex-1 flex-col overflow-scroll bg-white  border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-20 scrollbar-hide"
      >
        <For each={props.messages()}>
          {({ text, sender, sentAt }) => {
            const isMine = props.currentCorrespondent().publicKey !== sender;
            const name = isMine
              ? props.currentUser().name
              : props.currentCorrespondent().user.name;
            return <Message text={text} name={name} date={sentAt} isMine={isMine} />;
          }}
        </For>
      </div>
      <ControlPanel onSend={props.sendMessage} />
    </div>
  );
};
