import sendEmail from '@/lib/mailer';
import db from '@/lib/db';
export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const userExists = await db.User.findFirst({
				where: {
					email: req.body.email,
				},
			});
			if (!userExists) {
				return res.status(200).json({
					error: 'Email does not exist',
					status: false,
				});
			} else {
				await sendEmail({ email: req.body.email, emailType: 'PASSWORD' });
				return res.status(200).json({ status: true });
			}
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
