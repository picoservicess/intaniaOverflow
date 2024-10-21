import React from "react";

interface PrimaryButtonProps {
  onClick?: () => void;
  text: string;
}

export default function SecondaryButton({ onClick, text }: PrimaryButtonProps) {
  return (
    <button
      className="p px-3 py-1 border border-gray-300 rounded-md hover:bg-slate-100 active:bg-slate-200"
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
}
