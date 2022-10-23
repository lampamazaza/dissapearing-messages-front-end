import { Chat } from "@/types/api";

type TemporalChat = Omit<Chat, "id" | "lastMessage"> & {
  lastMessage: { text: string };
};

export type MessengerChat = TemporalChat | Chat;
