import { Paperclip } from "lucide-react";
import Link from "next/link";
import React from "react";

type Asset = {
  url: string;
  name: string;
};

interface FileProps {
  asset: Asset;
}

const FileLink: React.FC<FileProps> = ({ asset }) => {
  return (
    <Link
      href={asset.url}
      className="px-4 py-2 rounded-full bg-gray-200 flex items-center gap-2 w-min hover:bg-gray-300 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Paperclip size={16} />
      <p className="text-sm">{asset.name}</p>
    </Link>
  );
};

export default FileLink;
