"use server";

export default async function getVotes(isThread: boolean, targetId: string) {
	if (!targetId) {
		console.warn("getVotes: targetId is null or undefined");
		return { upVotes: 0, downVotes: 0, netVotes: 0 }; // Return default values
	}

	const url = new URL(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/votes`);
	url.searchParams.append("isThread", String(isThread));
	url.searchParams.append("targetId", targetId);

	const response = await fetch(url.toString(), {
		method: "GET",
	});

	if (!response.ok) {
		console.error(`getVotes failed with status: ${response.status}`);
		console.error(`URL attempted: ${url}`);
		return { upVotes: 0, downVotes: 0, netVotes: 0 }; // Return default values instead of throwing
	}

	return await response.json();
}
