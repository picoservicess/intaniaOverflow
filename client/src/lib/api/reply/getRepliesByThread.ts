"use server";

export default async function getRepliesByThread(threadId: string): Promise<Reply[]> {
	if (!threadId) {
		console.warn("getRepliesByThread: threadId is null or undefined");
		return [];
	}

	const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/replies/${threadId}`, {
		method: "GET",
	});

	if (!response.ok) {
		console.error(`getRepliesByThread failed with status: ${response.status}`);
		return []; // Return empty array instead of throwing
	}

	return (await response.json()) as Reply[];
}
