import { Chat, User, Message, MessagesPollingUpdates } from "@/types/api";
import { IMessageTransport } from "@/transport/messages";
import { IMessageEncryptionService } from "@/services/messageCryptoService";

interface IMessageService {
  getChatsByUserId: () => Promise<Chat[]>;
  pollingSubscriber: () => Promise<MessagesPollingUpdates>;
  getMessagesInChat: (alias: string) => Promise<Message[]>;
  getUserByAlias: (alias: string) => Promise<User>;
  sendMessage: (user) => Promise<Message>;
  getUserbyPublicKey: (publicKey: string) => Promise<User>;
}

export function initMessengerService({
  transportService,
  messageEncryptionService,
}: {
  transportService: IMessageTransport;
  messageEncryptionService: IMessageEncryptionService;
}): IMessageService {
  async function getChatsByUserId() {
    const chats = await transportService.getChatsByUserId();
    chats.forEach((chat) => {
      chat.lastMessage.text = messageEncryptionService.decrypt(
        chat.lastMessage.text,
        chat.publicKey
      );
    });

    return chats;
  }
  async function getUserByAlias(alias) {
    return transportService.getUserByAlias(alias);
  }

  async function getUserbyPublicKey(publicKey) {
    return transportService.getUserbyPublicKey(publicKey);
  }

  async function getMessagesInChat(publicKey) {
    const messages = await transportService.getMessagesInChat(publicKey);
    messages.forEach((message) => {
      message.text = messageEncryptionService.decrypt(message.text, publicKey);
    });
    return messages;
  }

  async function sendMessage(payload: {
    toPublicKey: string;
    message: string;
  }) {
    return transportService.sendMessage({
      toPublicKey: payload.toPublicKey,
      message: messageEncryptionService.encrypt(
        payload.message,
        payload.toPublicKey
      ),
    });
  }

  async function pollingSubscriber() {
    const messagesMap = await transportService.pollingSubscriber();
    for (let publicKey in messagesMap) {
      messagesMap[publicKey].forEach((message) => {
        message.text = messageEncryptionService.decrypt(
          message.text,
          message.sender
        );
      });
    }

    return messagesMap;
  }

  return {
    getChatsByUserId,
    getMessagesInChat,
    sendMessage,
    pollingSubscriber,
    getUserByAlias,
    getUserbyPublicKey,
  };
}
