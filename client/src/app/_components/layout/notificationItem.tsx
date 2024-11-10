import { Bookmark } from "lucide-react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ANONYMOUS_USER, cn, timeAgo } from "@/lib/utils";

const NotificationItem = ({
	notificationItem,
}: {
	notificationItem: NotificationItem;
}) => {
	const truncate = (text: string, maxLength: number) => {
		return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
	};

	return (
		<Link
			href={`/thread/${notificationItem.threadId}`}
			className={cn(
				"flex items-center gap-3 p-3 rounded-lg relative",
				"hover:bg-muted/50 transition-colors cursor-pointer"
			)}
		>
			{!notificationItem.isSeen && (
				<span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-destructive" />
			)}
			<div className="relative flex-shrink-0">
				<Avatar className="h-[52px] w-[52px]">
					<AvatarImage src={notificationItem.userProfile} alt={notificationItem.userName} />
					<AvatarFallback className="text-base">
						{notificationItem.userName[0] || ANONYMOUS_USER.displayname[0]}
					</AvatarFallback>
				</Avatar>
				{notificationItem.isPinned && (
					<Bookmark
						className="absolute -right-1 -bottom-1 text-muted-foreground"
						size={14}
						fill="currentColor"
					/>
				)}
			</div>
			<div className="flex flex-col gap-1 min-w-0">
				<p className="text-sm break-words pr-6">
					<span className="font-medium">{notificationItem.userName}</span>{" "}
					{notificationItem.isThread ? "ได้อัพเดตเธรด " : "ได้ตอบกลับเธรด "}
					<span className="font-medium">{truncate(notificationItem.threadTitle, 40)}</span>{" "}
					{!notificationItem.isThread
						? notificationItem.isPinned
							? "ที่คุณบันทึกไว้"
							: "ของคุณ"
						: "ที่คุณบันทึกไว้"}
				</p>
				<span className="text-xs text-muted-foreground">
					{timeAgo(new Date(notificationItem.createdAt))}
				</span>
			</div>
		</Link>
	);
};

export default NotificationItem;
