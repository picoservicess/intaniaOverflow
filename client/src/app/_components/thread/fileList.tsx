import React from "react";
import FileLink from "./fileLink";

interface FileListProps {
  assetUrls: string[];
}

export default function FileList({ assetUrls }: FileListProps) {
  return (
    <div className="flex justify-start gap-3 flex-wrap px-[80px]">
      {assetUrls.map((url) => {
        // Extract the filename from the URL
        const fileName = url.split('/').pop()!; // Get the last part of the URL
        const nameWithoutPrefix = fileName.split('_').slice(1).join('_'); // Remove everything before the first "_"
        
        return (
          <FileLink key={url} asset={{ url, name: nameWithoutPrefix }} />
        );
      })}
    </div>
  );
}
