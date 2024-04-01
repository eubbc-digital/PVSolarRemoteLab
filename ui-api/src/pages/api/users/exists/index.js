import db from '@/lib/db';

export default async function Post(req, res) {
	if (req.method === 'POST') {
		try {
			const userExists = await db.User.findFirst({
				where: {
					email: req.body.email,
				},
			});
			return res.status(422).json({ exists: userExists, status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
