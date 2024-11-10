import ReplySectionSkeleton from "@/app/_components/thread/replySectionSkeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function Loading() {
	return (
		<div className="bg-gray-100 min-h-screen animate-pulse">
			<div className="max-w-5xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col space-y-4 sm:space-y-6">
					<div className="flex-grow">
						<Card className="p-4 sm:p-6 mb-4 sm:mb-6 relative max-w-4xl mx-auto">
							<div className="absolute top-9 right-8 h-6 w-6 bg-gray-300 rounded-full" />
							<div className="h-8 sm:h-10 bg-gray-300 rounded-md mb-2 sm:mb-4" />

							{/* Tags Skeleton */}
							<div className="flex flex-wrap gap-2 mb-3">
								{Array.from({ length: 3 }).map((_, index) => (
									<span key={index} className="text-sm bg-gray-300 px-4 py-1 rounded-md w-12" />
								))}
							</div>

							{/* Author and Date Skeleton */}
							<div className="flex gap-2 items-center mb-4">
								<Avatar>
									<AvatarFallback className="bg-gray-300" />
								</Avatar>
								<div className="flex flex-col space-y-1">
									<div className="w-24 h-4 bg-gray-300 rounded-md" />
									<div className="w-16 h-4 bg-gray-300 rounded-md" />
								</div>
							</div>

							{/* Divider Skeleton */}
							<div className="w-full bg-gray-300 my-4 rounded-full h-[2px]" />

							{/* Body and Vote Section Skeleton */}
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="w-16 h-24 bg-gray-300 rounded-md" />
								<div className="flex-grow space-y-2">
									<div className="h-4 bg-gray-300 rounded-md" />
									<div className="h-4 bg-gray-300 rounded-md" />
									<div className="h-4 bg-gray-300 rounded-md" />
								</div>
							</div>

							{/* Image Gallery and File List Skeleton */}
							<div className="mt-4 space-y-2">
								{Array.from({ length: 1 }).map((_, index) => (
									<div key={index} className="w-full h-48 bg-gray-300 rounded-md" />
								))}
							</div>
						</Card>

						{/* Replies Section Skeleton */}
						<ReplySectionSkeleton />
					</div>
				</div>
			</div>
		</div>
	);
}
