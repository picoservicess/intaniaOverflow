import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const ANONYMOUS_USER: User = {
  displayname: "Anonymous",
  profileImage: "",
};

export const THREADS_PER_PAGE = 5;

export const FILE_SIZE_LIMIT = 5; // MB

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "ไม่ถึงนาทีที่แล้ว";
  } else if (minutes < 60) {
    return `${minutes} นาทีที่แล้ว`;
  } else if (hours < 24) {
    return `${hours} ชั่วโมงที่แล้ว`;
  } else if (days < 3) {
    return `${days} วันที่แล้ว`;
  } else if (now.getFullYear() === date.getFullYear()) {
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
    });
  } else {
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }
}
