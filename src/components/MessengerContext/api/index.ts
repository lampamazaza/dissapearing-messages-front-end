const API_ROOT = "http://localhost:8000";
const CHATS = `${API_ROOT}/chats`;

export async function getChatsByUserId(userId) {
  const response = await fetch(`${API_ROOT}/chats/chatsByUserId/${userId}`);

  return response.json();
}

export async function getMessagesInChat(userPublicKey) {
  const response = await fetch(`${API_ROOT}/messages/${userPublicKey}`);

  return response.json();
}

export async function sendMessage(payload: {
  toPublicKey: string;
  from: string;
  message: string;
}) {
  const response = await fetch(`${API_ROOT}/messages`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

export async function pollingSubscriber() {
  const response = await fetch(`${API_ROOT}/messages/subscribe`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
// export function initMessngerApi({ userId }) {
//   async function getChatsByUserId() {
//     const response = await fetch(`${API_ROOT}/chats/userId`);
//     if (!response.ok) throw new Error();
//     return response.json();
//   }
//   return {
//     getChatsByUserId,
//   };
// }
