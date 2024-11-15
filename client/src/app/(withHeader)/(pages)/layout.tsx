import { Suspense } from "react";

import Header from "@/app/_components/layout/header";
import HeaderSkeleton from "@/app/_components/layout/headerSkeleton";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Suspense fallback={<HeaderSkeleton />}>
				<Header />
			</Suspense>
			{children}
		</>
	);
}
