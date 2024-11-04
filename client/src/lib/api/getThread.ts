"use server";

export default async function getThread(token: string, threadId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/threads/${threadId}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch thread");
  }

  return await response.json();
}
