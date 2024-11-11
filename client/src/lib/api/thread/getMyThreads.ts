"use server";

export default async function getMyThread(token: string) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/threads/me`, {
		method: "GET",
		headers: {
			authorization: `Bearer ${token}`,
		},
		next: { tags: ["My Thread"] },
	});

	if (!response.ok) {
		console.error(`Failed to fetch my threads with status: ${response.status}`);
		return { threads: [] };
	}

	return await response.json();
}
