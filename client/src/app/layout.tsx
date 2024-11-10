import { Noto_Sans_Thai } from "next/font/google";

import "./globals.css";

const noto = Noto_Sans_Thai({ subsets: ["thai"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${noto.className} antialiased`}>{children}</body>
		</html>
	);
}
