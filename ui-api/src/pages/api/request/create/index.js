import db from '@/lib/db';
import sendEmail from '@/lib/requestMailer';
export default async function Post(req, res) {
	if (req.method === 'POST') {
		const { email, courseId } = req.body;
		try {
			await db.Request.create({
				data: {
					student: {
						connect: {
							userEmail: email,
						},
					},
					course: {
						connect: {
							id: courseId,
						},
					},
					status: 'Pending',
				},
			});
			const course = await db.Course.findFirst({
				where: {
					id: courseId,
				},
			});
			const student = await db.Student.findFirst({
				where: {
					userEmail: email,
				},
				include: {
					user: true,
				},
			});
			await sendEmail(
				course.teacherId,
				'REQUEST',
				course.name,
				student.user.name
			);

			return res.status(201).json({ status: true });
		} catch (error) {
			console.log(error);
			return res
				.status(400)
				.json({ error: 'Error Requesting, Please Try Again', status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
