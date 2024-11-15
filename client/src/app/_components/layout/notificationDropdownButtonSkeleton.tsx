import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotificationDropdownButtonSkeleton() {
	return (
		<Button
			variant="ghost"
			size="icon"
			className="relative h-9 w-9 md:h-10 md:w-10 cursor-wait hover:bg-white"
		>
			<Bell className="h-5 w-5 animate-pulse" />
		</Button>
	);
}
