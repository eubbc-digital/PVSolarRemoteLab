import db from '@/lib/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const deletedExperiment = await db.Experiment.delete({
				where: {
					id: req.body.id,
				},
			});
			return res.status(200).json(deletedExperiment);
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
