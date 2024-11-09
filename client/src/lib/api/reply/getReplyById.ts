"use server";

export default async function getReplyById(replyId: string): Promise<Reply> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/replies/${replyId}`, {
        method: 'GET',
        next: { tags: ["Replies"] },
    });

    if (!response.ok) {
        throw new Error("Cannot get replies for the thread");
    }
    
    return await response.json() as Reply[];
}
