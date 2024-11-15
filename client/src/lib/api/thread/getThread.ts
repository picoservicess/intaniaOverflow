"use server";

const EMPTY_THREAD = {
	assetUrls: [],
	tags: [],
	threadId: "",
	title: "",
	body: "",
	authorId: "",
	isAnonymous: true,
	createdAt: "",
	updatedAt: "",
	isDeleted: false,
};

export default async function getThread(token: string, threadId: string) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/threads/${threadId}`, {
		method: "GET",
		headers: {
			authorization: `Bearer ${token}`,
		},
		next: { tags: ["My Thread"] },
	});

	if (!response.ok) {
		// throw new Error("Failed to fetch thread");
		return EMPTY_THREAD;
	}

	return (await response.json()) as Thread;
}
