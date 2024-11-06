export default async function uploadFiles(token: string, files: File[]) {
  const results = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/asset/upload`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Cannot upload file: ${file.name}`);
    }

    results.push(await response.json());
  }

  return results;
}
