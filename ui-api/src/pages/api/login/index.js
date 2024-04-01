import db from '@/lib/db';
import { compare } from 'bcrypt';
import sendEmail from '@/lib/golc2024.js';
export default async function Post(req, res) {
	if (req.method === 'POST') {
		try {
			const credentials = await req.body;
			const user = await db.User.findFirst({
				where: {
					email: credentials.email,
				},
			});
			if (user.password) {
				if (user && (await compare(credentials.password, user.password))) {
					const { password, ...userWithoutPass } = user;
					if (credentials.email == 'golc2024@upb.edu') {
						sendEmail();
					}
					return res.status(200).json(userWithoutPass);
				} else {
					return res.status(400).json(null);
				}
			} else {
				return res.status(400).json(null);
			}
		} catch (error) {
			console.log(error);
			return res.status(400).json(null);
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
