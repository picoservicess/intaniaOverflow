"use server";

export default async function isUserVote(
	token: string,
	isThread: boolean,
	targetId: string
): Promise<VoteStatus> {
	if (!targetId) {
		console.warn("isUserVote: targetId is null or undefined");
		return { voteStatus: 0 }; // Return default values
	}

	const url = new URL(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/votes/checkvote`);
	url.searchParams.append("isThread", String(isThread));
	url.searchParams.append("targetId", targetId);

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		console.error(`isUserVote failed with status: ${response.status}`);
		console.error(`URL attempted: ${url}`);
		return { voteStatus: 0 }; // Return default values instead of throwing
	}

	return (await response.json()) as VoteStatus;
}
