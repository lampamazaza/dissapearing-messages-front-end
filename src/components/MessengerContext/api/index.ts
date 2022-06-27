const API_ROOT = "http://localhost:8000";

export function initMessengerApi(accessToken) {
  const credentials = "include";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  async function getChatsByUserId() {
    const response = await fetch(`${API_ROOT}/chats`, {
      credentials,
      headers,
    });

    return response.json();
  }

  async function getUserByAlias(alias) {
    const response = await fetch(`${API_ROOT}/users/${alias}`, {
      credentials,
      headers,
    });

    return response.json();
  }

  async function getUserbyPublicKey(publicKey) {
    const response = await fetch(`${API_ROOT}/users/byPublicKey/${publicKey}`, {
      credentials,
      headers,
    });

    return response.json();
  }

  async function getMessagesInChat(alias) {
    const response = await fetch(`${API_ROOT}/messages/${alias}`, {
      credentials,
      headers,
    });

    return response.json();
  }

  async function sendMessage(payload: {
    toPublicKey: string;
    message: string;
  }) {
    const response = await fetch(`${API_ROOT}/messages`, {
      method: "POST",
      credentials,
      body: JSON.stringify(payload),
      headers,
    });

    return response.json();
  }

  async function pollingSubscriber() {
    const response = await fetch(`${API_ROOT}/messages/subscribe`, {
      method: "POST",
      credentials,
      headers
    });

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
