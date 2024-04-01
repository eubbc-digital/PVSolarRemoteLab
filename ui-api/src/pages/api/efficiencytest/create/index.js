import db from '@/lib/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			req.body.efficiencyTest.forEach(async (record) => {
				const saved = await db.EfficiencyRecord.create({
					data: {
						cityLab: {
							connect: {
								id: req.body.id,
							},
						},
						voltage: record.voltage,
						current: record.current,
						power: record.power,
						city: record.city,
					},
				});
			});

			return res.status(200).json({ status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
