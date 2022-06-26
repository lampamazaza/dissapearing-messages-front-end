import type { Component } from "solid-js";
import { ConversationItem } from "@/components/ConversationItem";
import { NoChats } from "./NoChats";
import { For, Show } from "solid-js";
export const ConversationList: Component = (props) => {
  return (
    <Show when={props.chats().length > 0} fallback={<NoChats />}>
      <For each={props.chats()}>
        {({ user: { name, publicKey, alias }, lastMessage }, i) => (
          <ConversationItem
            name={name}
            lastMessage={lastMessage?.text}
            publicKey={publicKey}
            isActive={props.currentCorrespondent()?.publicKey === publicKey}
            alias={alias}
          />
        )}
      </For>
    </Show>
  );
};
