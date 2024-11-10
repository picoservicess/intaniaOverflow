import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	const protectedRoutes = ["/profile", "/thread"];

	const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

	if (isProtectedRoute && !token) {
		const loginUrl = new URL("/login", req.url);
		loginUrl.searchParams.set("callbackUrl", req.url);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/profile/:path*", "/thread/:path*"],
};
