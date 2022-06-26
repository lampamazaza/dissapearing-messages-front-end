import type { Component } from "solid-js";
import { ConversationItem } from "@/components/ConversationItem";
import { For, Show } from "solid-js";

export const NoChats: Component = () => {
  return (
    <div class="flex items-center justify-center h-full">
      🤔 No active chats
    </div>
  );
};
