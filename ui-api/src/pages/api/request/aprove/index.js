import db from '@/lib/db';
import sendEmail from '@/lib/requestMailer';
export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const joinCourse = await db.Student.update({
				where: {
					id: req.body.studentId,
				},
				data: {
					courses: {
						connect: {
							id: req.body.courseId,
						},
					},
				},
			});
			const course = await db.Course.findFirst({
				where: {
					id: req.body.courseId,
				},
			});

			await sendEmail(
				joinCourse.userEmail,
				'APPROVE',
				course.name,
				joinCourse.userEmail
			);
			const deletedRequest = await db.Request.delete({
				where: {
					id: req.body.id,
				},
			});

			return res.status(200).json({ status: true });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message, status: false });
		}
	} else {
		return res.status(500).json({ error: 'HTTP Method not Valid' });
	}
}
