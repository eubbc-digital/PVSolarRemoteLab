// Disable caching

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const env = {
				NEXT_PUBLIC_SERVICES_HOST: process.env.NEXT_PUBLIC_SERVICES_HOST,
				NEXT_PUBLIC_WS_SERVER_PORT: process.env.NEXT_PUBLIC_WS_SERVER_PORT,
				NEXT_PUBLIC_LINKCAMERACBBA: process.env.NEXT_PUBLIC_LINKCAMERACBBA,
				NEXT_PUBLIC_LINKCAMERALPZ: process.env.NEXT_PUBLIC_LINKCAMERALPZ,
				NEXT_PUBLIC_LINKCAMERASCZ: process.env.NEXT_PUBLIC_LINKCAMERASCZ,
				NEXT_PUBLIC_WSPORTCBBA: process.env.NEXT_PUBLIC_WSPORTCBBA,
				NEXT_PUBLIC_WSPORTSCZ: process.env.NEXT_PUBLIC_WSPORTSCZ,
				NEXT_PUBLIC_WSPORTLPZ: process.env.NEXT_PUBLIC_WSPORTLPZ,
				NEXT_PUBLIC_GRAFANA_LINK: process.env.NEXT_PUBLIC_GRAFANA_LINK,
			};
			return res.status(200).json({ variables: env, status: true });
		} catch (error) {
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
