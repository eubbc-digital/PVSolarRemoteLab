import mqttClient from '@/lib/mqtt';

export default function handler(req, res) {
	if (req.method === 'GET') {
		mqttClient.publish('solarlab/hello', 'hello', { qos: 2 });
		res.status(200).json({ status: true });
	} else {
		return res
			.status(500)
			.json({ error: 'HTTP Method not Valid', status: false });
	}
}
