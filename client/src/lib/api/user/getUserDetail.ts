"use server";

import { ANONYMOUS_USER } from "@/lib/utils";

export default async function getUserDetail(token: string, userId: string) {
  if (!userId) return ANONYMOUS_USER;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_GATEWAY_URL}/users/userDetail/${userId}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response) {
    throw new Error("Cannot get user detail");
  }

  const userDetail = await response.json();
  if (userDetail.error) return ANONYMOUS_USER;

  return userDetail;
}
