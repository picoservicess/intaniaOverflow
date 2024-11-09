"use server";

export default async function markNotificationAsSeen(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/notifications`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark notifications as seen");
  }

  return await response.json();
}
