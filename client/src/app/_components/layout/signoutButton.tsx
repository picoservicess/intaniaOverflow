"use client";

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";

import React from "react";

import { signOut } from "next-auth/react";

export default function SignoutButton() {
	return (
		<DropdownMenuItem asChild>
			<div
				className="w-full cursor-pointer"
				onClick={() =>
					signOut({
						callbackUrl: process.env.BASE_URL || "http://localhost:3001",
						redirect: false,
					})
				}
			>
				<LogOut className="mr-2 h-4 w-4" />
				<span>ออกจากระบบ</span>
			</div>
		</DropdownMenuItem>
	);
}
