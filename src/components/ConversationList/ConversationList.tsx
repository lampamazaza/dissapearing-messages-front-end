import type { Accessor, Component } from "solid-js";
import { ConversationItem } from "@/components/ConversationItem";
import { Button } from "@/components/Button";
import { NoChats } from "./NoChats";
import { For, Show } from "solid-js";
import baton from "@/services/baton";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { isMobile } from "@/utils/isMobile";
import { shareNative } from "@/utils/shareNative";
import { Chat, User } from "@/types/api";

export const ConversationList: Component<{
  currentUser: Accessor<User>;
  chats: Accessor<Chat[]>;
  currentCorrespondent: Accessor<Chat>;
  logout: () => Promise<void>;
}> = (props) => {
  const share = async () => {
    const link = window.location.origin + "/?m=" + props.currentUser().alias;
    if (isMobile() && window.navigator.share) {
      try {
        shareNative("Click to start chatting", link);
      } catch {
        baton.error("Failed to share");
      }
    } else {
      await copyToClipboard(link);
      baton.success("Share link copied");
    }
  };

  return (
    <div class="h-screen pb-32">
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
      <div class="flex justify-center p-8 absolute bottom-0 left-0 right-0 gap-8 flex-col">
        <Button onClick={share}>
          {isMobile() && window.navigator.share
            ? "Share chat link"
            : "Copy chat link"}
        </Button>
        <Button onClick={props.logout}>Logout</Button>
      </div>
    </div>
  );
};
