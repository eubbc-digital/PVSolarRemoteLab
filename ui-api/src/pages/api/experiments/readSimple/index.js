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
			const experiments = await db.Experiment.findMany({
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
			});
			return res.status(200).json({ experiments: experiments, status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
