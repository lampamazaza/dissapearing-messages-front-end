export type PublicKey = string;
export type User = {
  id: number;
  name: string;
  alias: string;
  publicKey: PublicKey;
};

export type Chat = {
  id: number;
  publicKey: PublicKey;
  user: User;
  lastMessage: Message;
};

export type Message = {
  id: number;
  sender: string;
  text: string;
  sentAt: string;
};

export type MessagesPollingUpdates = Record<PublicKey, Message[]>;
