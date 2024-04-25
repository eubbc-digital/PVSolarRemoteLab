import NextAuth from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
	providers: [
		CredentialsProvider({
			async authorize(credentials, req) {
				const user = {
					email: credentials.email,
					password: credentials.password,
				};
				const response = await fetch(`${process.env.DOMAIN}/api/login`, {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify(user),
				});
				const session = await response.json();
				if (session) {
					return session;
				} else {
					return null;
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async signIn({ account, profile }) {
			if (account.provider == 'google') {
				const response = await fetch(`${process.env.DOMAIN}/api/users/exists`, {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify({ email: profile.email }),
				});
				const answer = await response.json();
				if (answer.status) {
					if (answer.exists) {
						return true;
					} else {
						const response = await fetch(
							`${process.env.DOMAIN}/api/google/create`,
							{
								headers: {
									'Content-Type': 'application/json',
								},
								method: 'POST',
								body: JSON.stringify({
									email: profile.email,
									name: profile.name,
								}),
							}
						);
						const answer = await response.json();
						if (answer.status) {
							return true;
						} else {
							return false;
						}
					}
				} else {
					return null;
				}
			}
			return true;
		},
	},
};

export default NextAuth(authOptions);
