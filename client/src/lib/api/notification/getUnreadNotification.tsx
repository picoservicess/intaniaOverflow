"use server";

export default async function getUnreadNotifications(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/notifications/unread`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unread notifications");
  }

  return await response.json();
}
