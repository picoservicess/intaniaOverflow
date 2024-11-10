"use server";

export default async function isUserVote(
	token: string,
	isThread: boolean,
	targetId: string
): Promise<VoteStatus> {
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
		throw new Error("Failed to check vote status");
	}

	return (await response.json()) as VoteStatus;
}
