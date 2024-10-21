import { Bai_Jamjuree, Anuphan } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "../components/header";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import NextAuthProvider from "@/providers/NextAuthProvider";

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
        <NextAuthProvider session={session}>
          <Header />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
