// Disable caching

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const env = {
				NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
				NEXT_PUBLIC_LINKCAMERACBBA: process.env.NEXT_PUBLIC_LINKCAMERACBBA,
				NEXT_PUBLIC_LINKCAMERALPZ: process.env.NEXT_PUBLIC_LINKCAMERALPZ,
				NEXT_PUBLIC_LINKCAMERASCZ: process.env.NEXT_PUBLIC_LINKCAMERASCZ,
				NEXT_PUBLIC_WS_CAMERA_CBBA: process.env.NEXT_PUBLIC_WS_CAMERA_CBBA,
				NEXT_PUBLIC_WS_CAMERA_LPZ: process.env.NEXT_PUBLIC_WS_CAMERA_LPZ,
				NEXT_PUBLIC_WS_CAMERA_SCZ: process.env.NEXT_PUBLIC_WS_CAMERA_SCZ,
				NEXT_PUBLIC_GRAFANA_LINK: process.env.NEXT_PUBLIC_GRAFANA_LINK,
				NEXT_PUBLIC_WS_DATA_PATH: process.env.NEXT_PUBLIC_WS_DATA_PATH,
				NEXT_PUBLIC_WS_DATA: process.env.NEXT_PUBLIC_WS_DATA,
			};
			return res.status(200).json({ variables: env, status: true });
		} catch (error) {
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
