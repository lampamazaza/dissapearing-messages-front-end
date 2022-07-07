import { ft } from "@/utils/ft";

export function initMessengerApi({ onAuthFail }) {
  async function getChatsByUserId() {
    const response = await ft("/chats");

    if (response.status === 401) {
      onAuthFail();
      return;
    }

    return response.json();
  }

  async function getUserByAlias(alias) {
    const response = await ft(`/users/${alias}`);

    if (response.status === 401) {
      onAuthFail();
      return;
    }
    return response.json();
  }

  async function getUserbyPublicKey(publicKey) {
    const response = await ft(`/users/byPublicKey/${publicKey}`);
    if (response.status === 401) {
      onAuthFail();
      return;
    }
    return response.json();
  }

  async function getMessagesInChat(alias) {
    const response = await ft(`/messages/${alias}`);
    if (response.status === 401) {
      onAuthFail();
      return;
    }
    return response.json();
  }

  async function sendMessage(payload: {
    toPublicKey: string;
    message: string;
  }) {
    const response = await ft("/messages", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (response.status === 401) {
      onAuthFail();
      return;
    }
    return response.json();
  }

  async function pollingSubscriber() {
    const response = await ft("/messages/subscribe", {
      method: "POST",
    });
    if (response.status === 401) {
      onAuthFail();
      return;
    }
    return response.json();
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
