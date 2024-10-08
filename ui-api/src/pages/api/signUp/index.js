import db from '@/lib/db';
import { hash } from 'bcrypt';
import sendEmail from '@/lib/mailer';

export default async function Post(req, res) {
	if (req.method === 'POST') {
		const { email, name, password, isTeacher } = req.body;
		const userExists = await db.User.findFirst({
			where: {
				email: email,
			},
		});
		if (userExists) {
			return res.status(422).json({ error: 'User Already Exists..!' });
		} else {
			try {
				await db.User.create({
					data: {
						email: email,
						name: name,
						password: await hash(password, 12),
						isVerified: false,
					},
				});
				if (isTeacher) {
					await db.Teacher.create({
						data: {
							user: {
								connect: {
									email: email,
								},
							},
							authorized: false,
						},
					});
					await sendEmail({
						email,
						emailType: 'TEACHER',
					});
				} else {
					await db.Student.create({
						data: {
							user: {
								connect: {
									email: email,
								},
							},
							courses: {
								connect: {
									id: 11, //Join to Personal Course by Solar Lab - HOTFIX to all users can save experiments
								},
							},
						},
					});
				}
				await sendEmail({ email, emailType: 'VERIFY' });
				return res.status(201).json({ status: true });
			} catch (error) {
				console.log(error);
				return res.status(400).json({ error: 'Error Creating User' });
			}
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
