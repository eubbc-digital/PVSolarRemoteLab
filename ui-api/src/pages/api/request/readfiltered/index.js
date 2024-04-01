import db from '@/lib/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const requests = await db.Request.findMany({
				where: {
					studentEmail: {
						equals: req.body.email,
					},
				},
			});
			return res.status(200).json({ requests: requests, status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
