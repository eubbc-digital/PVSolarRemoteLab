import mqttClient from '@/lib/mqtt';

export default function handler(req, res) {
	const topicCbba = 'solarlab/esp32/cbba';
	const topicScz = 'solarlab/esp32/scz';
	const topicLpz = 'solarlab/esp32/lpz';
	if (req.method === 'POST') {
		try {
			if (req.body.department == 'Cochabamba') {
				responseESP(req.body, topicCbba);
			} else if (req.body.department == 'La Paz') {
				responseESP(req.body, topicLpz);
			} else if (req.body.department == 'Santa Cruz') {
				responseESP(req.body, topicScz);
			} else if (req.body.department == 'ALL') {
				responseESP(req.body, topicCbba);
				responseESP(req.body, topicLpz);
				responseESP(req.body, topicScz);
			}
			res.status(200).json({ status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error, status: false });
		}
	} else {
		return res
			.status(500)
			.json({ error: 'HTTP Method not Valid', status: false });
	}
}

function responseESP(action, topic) {
	mqttClient.publish(topic, JSON.stringify(action), { qos: 2 });
}
