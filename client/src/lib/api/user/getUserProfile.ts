"use server";

export default async function getUserProfile(token: string) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/users/userProfile`, {
		method: "GET",
		headers: {
			authorization: `Bearer ${token}`,
		},
		next: { tags: ["userProfile"] },
	});

	if (!response) {
		throw new Error("Cannot get user profile");
	}

	return (await response.json()) as UserProfile;
}
