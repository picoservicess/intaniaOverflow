"use server";

export default async function getAllNotification(token: string) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/notifications`, {
		method: "GET",
		headers: {
			authorization: `Bearer ${token}`,
		},
		next: { tags: ["Notification"] },
	});

	if (!response.ok) {
		console.log(`Failed to fetch notifications with status: ${response.status}`);
		return [];
	}

	return await response.json();
}
