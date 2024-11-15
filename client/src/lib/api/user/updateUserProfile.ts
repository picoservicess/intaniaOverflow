"use server";

import { revalidateTag } from "next/cache";

export default async function updateUserProfile(
	token: string,
	displayname?: string,
	profileImageUrl?: string
) {
	const body: Record<string, string> = {};
	if (displayname) body.displayname = displayname;
	if (profileImageUrl) body.profileImage = profileImageUrl;

	const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/users/userProfile`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error("Cannot update user profile");
	}

	revalidateTag("userProfile");

	return await response.json();
}
