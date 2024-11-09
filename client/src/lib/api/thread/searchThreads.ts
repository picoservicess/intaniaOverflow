"use server";

export default async function searchThreads(query: string, page: number): Promise<SearchThreadResponse> {
    const url = new URL(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/threads/search`);
    url.searchParams.append("query", query);
    url.searchParams.append("page", String(page));
    url.searchParams.append("pageSize", String(5));
  
    const response = await fetch(url.toString(), {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error("Failed to search threads");
    }
  
    return await response.json() as SearchThreadResponse;
  }