"use server";

export default async function getRepliesByThread(threadId: string): Promise<Reply[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/replies/${threadId}`, {
		method: "GET",
	});

	if (!response.ok) {
		throw new Error("Cannot get replies for the thread");
	}

	return (await response.json()) as Reply[];
}
