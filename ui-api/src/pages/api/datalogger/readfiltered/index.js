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
			if (req.body.city == 'Cochabamba') {
				const data = await db.Datalogger.findMany({
					select: {
						datetime: true,
						solarRadiationCMPAvg: true,
						uvaRadiationLPAvg: true,
					},
					where: {
						datetime: {
							contains: req.body.date,
						},
					},
					orderBy: {
						id: 'asc',
					},
				});
				return res.status(200).json({ data: data, status: true });
			} else if (req.body.city == 'La Paz') {
				const data = await db.DataloggerLPZ.findMany({
					select: {
						datetime: true,
						solarRadiationCS320Avg: true,
						uvaRadiationSU202Avg: true,
					},
					where: {
						datetime: {
							contains: req.body.date,
						},
					},
					orderBy: {
						id: 'asc',
					},
				});
				return res.status(200).json({ data: data, status: true });
			} else {
				const data = await db.DataloggerSCZ.findMany({
					select: {
						datetime: true,
						solarRadiationCS320Avg: true,
						uvaRadiationSU202Avg: true,
					},
					where: {
						datetime: {
							contains: req.body.date,
						},
					},
					orderBy: {
						id: 'asc',
					},
				});
				return res.status(200).json({ data: data, status: true });
			}
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
