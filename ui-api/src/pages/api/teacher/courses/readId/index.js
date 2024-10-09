import db from '@/lib/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const course = await db.Course.findFirst({
				where: {
					id: req.body.id,
				},
				include: {
					students: {
						include: {
							user: true,
						},
					},
				},
			});
			return res.status(200).json({ course: course, status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
