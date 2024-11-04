"use server";

const ANONYMOUS_USER: User = {
  displayname: "Anonymous",
  profileImage: "",
}

export default async function getUserDetail(token: string, userId: string) {
  if (userId === "") return ANONYMOUS_USER;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/users/userDetail/${userId}`, {
    method: 'GET',
    headers: {
        authorization: `Bearer ${token}`,
      },
  });

  if (!response) {
    throw new Error("Cannot get user detail");
  }

  return await response.json();
}
