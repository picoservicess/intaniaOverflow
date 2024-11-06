"use server";

export default async function applyUpVote(token: string, isThread: boolean, targetId: string): Promise<ApplyUpVote> {
    const body = {
        isThread,
        targetId,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/votes/upvote`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error("Failed to apply upvote");
    }

    return await response.json() as ApplyUpVote;
}
