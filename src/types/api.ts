export type User = {
  id: number;
  name: string;
  alias: string;
  publicKey: string;
};

export type Chat = {
  id: number,
  publicKey: string,
  user: User,
  lastMessage: Message
};

export type Message = {
  id: number
  sender: string
  text: string
  sentAt: string
}