"use server";

export default async function getRepliesByThread(token: string, threadId: string): Promise<Reply[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/replies/${threadId}`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${token}`,
        },
        next: { tags: ["Replies"] },
    });

    if (!response.ok) {
        throw new Error("Cannot get replies for the thread");
    }
    
    return await response.json() as Reply[];
}
