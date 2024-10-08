import db from '@/lib/db';

export const config = {
	api: {
		responseLimit: false,
		// responseLimit: '8mb',
	},
};

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const courses = await db.Course.findMany({
				where: {
					students: {
						some: {
							userEmail: {
								equals: req.body.email,
							},
						},
					},
				},
				include: {
					teacher: {
						include: {
							user: true,
						},
					},
				},
			});
			return res.status(200).json({ courses: courses, status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
