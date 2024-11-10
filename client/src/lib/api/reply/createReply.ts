"use server";

export default async function createReply(
  token: string,
  threadId: string,
  replyData: ReplyRequest
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_GATEWAY_URL}/replies/${threadId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(replyData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create reply");
  }

  return await response.json() as CreateReplyResponse;
}
