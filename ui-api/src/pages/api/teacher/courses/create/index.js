import db from '@/lib/db';

export default async function Post(req, res) {
	if (req.method === 'POST') {
		const { email, name, description, startDate, endDate } = req.body;
		try {
			await db.Course.create({
				data: {
					teacher: {
						connect: {
							userEmail: email,
						},
					},
					name: name,
					description: description,
					startDate: startDate,
					endDate: endDate,
				},
			});

			return res.status(201).json({ status: true });
		} catch (error) {
			console.log(error);
			return res
				.status(400)
				.json({ error: 'Error Requesting, Please Try Again', status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
