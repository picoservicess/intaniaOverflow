import React from "react";

import FileLink from "./fileLink";

interface FileListProps {
  assetUrls: string[];
}

export default function FileList({ assetUrls }: FileListProps) {
  return (
    <div className="flex justify-start gap-3 flex-wrap">
      {assetUrls.map((url) => {
        const fileName = url.split("/").pop()!;
        const nameWithoutPrefix = fileName.split("_").slice(1).join("_");
        return <FileLink key={url} asset={{ url, name: nameWithoutPrefix }} />;
      })}
    </div>
  );
}
