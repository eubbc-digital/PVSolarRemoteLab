import db from '@/lib/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const updateUser = await db.User.update({
				where: {
					email: req.body.email,
				},
				data: {
					name: req.body.name,
				},
			});
			return res.status(200).json(updateUser);
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
