"use server";

export default async function applyDownVote(
  token: string,
  isThread: boolean,
  targetId: string
): Promise<ApplyDownVote> {
  const body = {
    isThread,
    targetId,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_GATEWAY_URL}/votes/downvote`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to apply downvote");
  }

  return (await response.json()) as ApplyDownVote;
}
