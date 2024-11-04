"use server";

export default async function createThread(token: string, threadData: ThreadRequest) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/threads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(threadData),
  });

  if (!response.ok) {
    throw new Error("Failed to create thread");
  }

  return await response.json();
}