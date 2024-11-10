import { getServerSession } from "next-auth";
import { Anuphan, Bai_Jamjuree } from "next/font/google";

import { cn } from "@/lib/utils";
import NextAuthProvider from "@/providers/NextAuthProvider";

import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import "./globals.css";

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-bai-jamjuree",
});

const anuphan = Anuphan({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-anuphan",
});

export default async function RootLayout({
  children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={cn(anuphan.variable, bai_jamjuree.variable)}>
        <NextAuthProvider session={session}>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
