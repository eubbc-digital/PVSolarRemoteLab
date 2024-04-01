import db from '@/lib/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const experiment = await db.Experiment.findFirst({
				where: {
					AND: [
						{
							studentEmail: req.body.email,
						},
						{
							courseId: req.body.courseId,
						},
					],
				},
				include: {
					cityLabs: {
						include: {
							activities: {
								include: {
									efficiencyCurve: {
										include: {
											efficiencyRecords: {
												orderBy: {
													voltage: 'desc',
												},
											},
										},
									},
								},
							},
						},
					},
				},
			});
			return res.status(200).json({ experiment: experiment, status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
