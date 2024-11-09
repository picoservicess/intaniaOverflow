"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CUIcon from "../assets/account-link-logo-cu.svg";

const LoginPage = () => {
	const router = useRouter();

	const handleChulaSSOSignIn = async () => {
		try {
			router.push(
				"https://account.it.chula.ac.th/login?serviceName=app.vercel.sci-locker&service=http://localhost:3001/api/auth/callback/chula-sso"
			);
		} catch (error) {
			console.error("Error signing in with Chula SSO:", error);
			// TODO: Handle sign-in error (e.g., show error message to user)
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<Button
						variant="outline"
						className="w-full flex items-center justify-center gap-2"
						onClick={handleChulaSSOSignIn}
					>
						Connect with
						<div className="flex w-8 h-8 items-center justify-center">
							<CUIcon />
						</div>
						Account
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginPage;
