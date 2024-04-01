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
			if (req.body.isTeacher) {
				await db.Teacher.create({
					data: {
						user: {
							connect: {
								email: req.body.email,
							},
						},
						authorized: false,
					},
				});
			} else {
				await db.Student.create({
					data: {
						user: {
							connect: {
								email: req.body.email,
							},
						},
					},
				});
			}
			return res.status(200).json({ user: updateUser, status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
