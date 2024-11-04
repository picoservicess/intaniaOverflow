"use server";

export default async function getAllThreads() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/threads`, {
    method: "GET",
    next: { tags: ["allThreads"] },
  });

  if (!response) {
    throw new Error("Cannot get all threads");
  }

  return await response.json();
}
