import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const experimentToSave = await db.Experiment.create({
				data: {
					name: req.body.experimentName,
					experimentDate: req.body.experimentDate,
					experimentTime: req.body.experimentTime,
					timezone: req.body.timezone,
					student: {
						connect: {
							userEmail: req.body.email,
						},
					},
					cityLabs: {
						createMany: { data: req.body.cities },
					},
					course: {
						connect: {
							id: req.body.courseId,
						},
					},
				},
			});
			req.body.activities.forEach((city) => {
				const activitiesWithId = city.activities.map((activity) => ({
					...activity,
					activityId: uuidv4(),
				}));
				activitiesWithId.forEach(async (activity) => {
					const activitiesToSave = await db.Activity.create({
						data: {
							id: activity.activityId,
							activityNumber: activity.activityNumber,
							panelAngle: activity.panelAngle,
							temperature: activity.temperature,
							power: activity.power,
							efficiencyPorcentaje: activity.efficiencyPorcentaje,
							optimalAngle: activity.optimalAngle,
							uvaRadiation: activity.uvaRadiation,
							radiation: activity.radiation,
							cityLab: {
								connect: { id: city.id },
							},
						},
					});
					activity.efficiencyCurve.forEach(async (curve) => {
						if (curve.length > 0) {
							const efficiencyCurves = await db.EfficiencyCurve.create({
								data: {
									activity: {
										connect: { id: activity.activityId },
									},
									efficiencyRecords: {
										createMany: { data: curve },
									},
								},
							});
						}
					});
				});
			});

			return res
				.status(200)
				.json({ experimentToSave: experimentToSave, status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
