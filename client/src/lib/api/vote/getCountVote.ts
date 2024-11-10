"use server";

export default async function getVotes(isThread: boolean, targetId: string) {
	const url = new URL(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/votes`);
	url.searchParams.append("isThread", String(isThread));
	url.searchParams.append("targetId", targetId);

	const response = await fetch(url.toString(), {
		method: "GET",
	});

	if (!response.ok) {
		throw new Error("Failed to fetch votes");
	}

	return await response.json();
}
