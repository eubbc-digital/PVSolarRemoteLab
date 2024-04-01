import db from '@/lib/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const validUser = await db.User.findFirst({
				where: {
					verifiedToken: req.body.token,
				},
			});
			if (!validUser) {
				return res.status(200).json({ error: 'Invalid Token', status: false });
			} else {
				const updatedUser = await db.User.update({
					where: {
						email: validUser.email,
					},
					data: {
						isVerified: true,
						verifiedToken: null,
						tokenExpiry: null,
					},
				});
				return res.status(200).json({ status: true });
			}
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
