const API_ROOT = "http://localhost:8000";

export async function createUser(payload: {
  name: string;
  alias: string;
  publicKey: string;
}): Promise<{}> {
  const response = await fetch(`${API_ROOT}/users`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.message);
  }

  return response.json();
}
export async function getAuthenticationData(publicKey: string): Promise<{
  iv: Uint8Array;
  msg: Uint8Array;
  publicKey: Uint8Array;
}> {
  const response = await fetch(
    `${API_ROOT}/users/authenticationData/${publicKey}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to get authentication data");

  const json = await response.json();

  for (let key in json) {
    json[key] = Uint8Array.from(json[key]);
  }
  return json;
}

export async function authenticate(
  decryptedMsg: Uint8Array,
  publicKey: string
): Promise<{ accessToken: string; user: any }> {
  const response = await fetch(`${API_ROOT}/users/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ decryptedMsg: Array.from(decryptedMsg), publicKey }),
  });

  if (!response.ok) throw new Error("Failed to get authenticate");

  return response.json();
}
