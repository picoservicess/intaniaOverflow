"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

export default function PinButton({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) {
  const [pinned, setPinned] = useState(false);

  return (
    <div
      className={`cursor-pointer ${className ? className : ""}`}
      role="button"
      aria-pressed={pinned}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setPinned(!pinned);
      }}
    >
      <Bookmark size={size} fill={pinned ? "#000000" : "none"} />
    </div>
  );
}
