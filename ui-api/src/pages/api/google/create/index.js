import db from '@/lib/db';
export default async function Post(req, res) {
	if (req.method === 'POST') {
		try {
			await db.User.create({
				data: {
					email: req.body.email,
					name: req.body.name,
					isVerified: true,
				},
			});
			return res.status(201).json({ status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: 'Error Creating User' });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
