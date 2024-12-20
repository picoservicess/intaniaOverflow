// pages/api/auth/[...nextauth].js
import axios from "axios";

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			id: "ticket",
			name: "Ticket",
			credentials: {
				ticket: { label: "Ticket", type: "text" },
			},
			async authorize(credentials) {
				const ticket = credentials?.ticket;

				if (!ticket) {
					console.log("No ticket found");
					return null;
				}

				try {
					// Validate the ticket with your SSO
					const response = await axios.post("http://localhost:80/users/login", {
						ticket,
					});

					const { token, userId } = response.data;

					if (response.data) {
						return {
							id: userId,
							accessToken: token,
						};
					}

					return null;
				} catch (error) {
					console.error("Ticket authentication error:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user };
		},
		async session({ session, token, user }) {
			session.user = token as any;
			return session;
		},
	},
	pages: {
		signIn: "/auth/signin",
		error: "/error",
	},
	session: {
		strategy: "jwt",
		maxAge: 60 * 60, // 1 hour
	},
};
