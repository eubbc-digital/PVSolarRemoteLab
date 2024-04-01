export default async function handler(req, res) {
	if (req.method === 'POST') {
		const access_key = req.body.access_key;
		const pwd = req.body.pwd;
		const response = await fetch(
			`${process.env.HOST_BOOKING}?access_key=${access_key}&pwd=${pwd}`,
			{
				method: 'GET',
			}
		);

		const data = await response.json();
		if (!data.length) {
			return res.status(200).json({ status: false });
		} else {
			return res.status(200).json({ status: true, data: data[0] });
		}
	} else {
		return res.status(400).json({ error: 'Metodo Incorrecto' });
	}
}
