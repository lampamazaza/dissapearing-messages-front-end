const API_ROOT = "http://localhost:8000";

export async function createUser(payload: { name: string, alias: string, publicKey: string }): Promise<{}> {
  const response = await fetch(`${API_ROOT}/users`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if(!response.ok) throw new Error("Failed to create a user")
  
  return response.json();
}
