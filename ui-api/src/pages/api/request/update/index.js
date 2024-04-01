import db from '@/lib/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const update = await db.Request.update({
				where: {
					id: req.body.id,
				},
				data: {
					status: req.body.status,
				},
			});
			return res.status(200).json({ status: true, update: update });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
