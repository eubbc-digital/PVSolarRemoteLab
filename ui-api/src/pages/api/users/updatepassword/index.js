import db from '@/lib/db';
import { hash, compare } from 'bcrypt';
export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const oldPassword = await db.User.findFirst({
				where: {
					email: req.body.email,
				},
				select: {
					password: true,
				},
			});
			if (await compare(req.body.oldPassword, oldPassword.password)) {
				const updateUser = await db.User.update({
					where: {
						email: req.body.email,
					},
					data: {
						password: await hash(req.body.password, 12),
					},
				});
				return res.status(200).json({ status: true });
			} else {
				return res
					.status(200)
					.json({ error: 'Incorrect Old Password', status: false });
			}
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				error: 'Something Went Wrong, Please Try Again Later',
				status: false,
			});
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
