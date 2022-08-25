import { ft } from "@/utils/ft";
import {MSG_ROOT, CHATS_ROOT, USERS_ROOT} from "@/constants/apiPaths"

export function initMessengerApi({ onAuthFail }) {
  async function getChatsByUserId() {
    const response = await ft(CHATS_ROOT);

    if (response.status === 401) {
      onAuthFail();
      return;
    }

    return response.json();
  }

  async function getUserByAlias(alias) {
    const response = await ft(`${USERS_ROOT}/${alias}`);

    if (response.status === 401) {
      onAuthFail();
      return;
    }
    return response.json();
  }

  async function getUserbyPublicKey(publicKey) {
    const response = await ft(`${USERS_ROOT}/byPublicKey/${publicKey}`);
    if (response.status === 401) {
      onAuthFail();
      return;
    }
    return response.json();
  }

  async function getMessagesInChat(alias) {
    const response = await ft(`${MSG_ROOT}/${alias}`);
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
    const response = await ft(MSG_ROOT, {
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
    const response = await ft(`${MSG_ROOT}/subscribe`, {
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
