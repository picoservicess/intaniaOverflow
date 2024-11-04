"use server";

import { revalidateTag } from "next/cache";

export default async function applyPin(token: string, threadId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/users/applyPin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ threadId }),
  });

  if (!response.ok) {
    throw new Error("Cannot apply pin to the thread");
  }

  revalidateTag("Pinned");

  return await response.json();
}
