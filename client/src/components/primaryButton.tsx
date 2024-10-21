import React from "react";

interface PrimaryButtonProps {
  onClick?: () => void;
  text: string;
}

export default function PrimaryButton({ onClick, text }: PrimaryButtonProps) {
  return (
    <button
      className="p px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-600 active:bg-slate-500"
      onClick={onClick}
      type="submit"
    >
      <p className="text-white">{text}</p>
    </button>
  );
}
