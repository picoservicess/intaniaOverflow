"use server";

export default async function getMyThread(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_GATEWAY_URL}/threads/me`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
      next: { tags: ["My Thread"] },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch my thread");
  }

  return await response.json();
}
