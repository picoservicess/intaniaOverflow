import Icon from "@/app/assets/icon.svg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import NotificationDropdownButtonSkeleton from "./notificationDropdownButtonSkeleton";

export default function HeaderSkeleton() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-3 transition-colors hover:opacity-90">
						<div className="w-8 h-8">
							<Icon />
						</div>
						<div className="text-xl font-medium">
							<span className="text-foreground">intania</span>
							<span className="text-[#872f2f] font-bold">Overflow</span>
						</div>
					</div>
					<div className="flex items-center gap-2 md:gap-4">
						<NotificationDropdownButtonSkeleton />
						<Button variant="ghost" className="relative h-8 w-8 rounded-full animate-pulse">
							<Avatar className="h-8 w-8">
								<AvatarFallback className="text-sm"></AvatarFallback>
							</Avatar>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
