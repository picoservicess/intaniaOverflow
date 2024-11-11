"use server";

export default async function viewPinned(token: string) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/users/viewPinned`, {
		method: "GET",
		headers: {
			authorization: `Bearer ${token}`,
		},
		next: { tags: ["Pinned"] },
	});

	if (!response.ok) {
		console.error(`Failed to fetch pinned threads with status: ${response.status}`);
		return { threads: [] };
	}

	return await response.json();
}
