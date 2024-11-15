import NotificationItem from "./notificationItem";

export default function NotificationDropdownContent({
	notificationItems,
}: {
	notificationItems: NotificationItem[];
}) {
	return (
		<>
			{notificationItems.length > 0 ? (
				notificationItems.map((notificationItem, index) => (
					<NotificationItem key={index} notificationItem={notificationItem} />
				))
			) : (
				<div className="p-3 text-center text-muted-foreground">ไม่พบการแจ้งเตือน</div>
			)}
		</>
	);
}
