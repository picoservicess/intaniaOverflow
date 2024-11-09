"use server"

import { revalidateTag } from "next/cache";

export default async function updateThread(token: string, threadId: string, updateData: ThreadRequest) {
  console.log(updateData);
  const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/threads/${threadId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error("Failed to update thread");
  }

  console.log(await response.json());

  revalidateTag("Thread");

  return await response.json();
}
