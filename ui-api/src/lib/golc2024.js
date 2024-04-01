import nodemailer from 'nodemailer';

export const sendEmail = async () => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST_SMTP,
			port: process.env.PORT_SMTP,
			auth: {
				user: process.env.USER_SMTP,
				pass: process.env.PWD_SMTP,
			},
		});

		const mailOptions = {
			from: process.env.USER_SMTP,
			to: 'andresgamboabaldi@gmail.com',
			subject: 'GOLC2024 Judge has Logged In!',
			html: `<body style="background: #f9f9f9;">
                                <table width="100%" border="0" cellspacing="20" cellpadding="0"
                                style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
                                <tr>
                                    <td align="center"
                                    style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #000000;"> 
                                    The Judges are in the platform. Log In!
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                        <td align="center" style="border-radius: 5px;" bgcolor="#14287A"><a href="${process.env.DOMAIN}"
                                            target="_blank"
                                            style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #14287A; display: inline-block; font-weight: bold;">Go to Solar Remote Lab</a></td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center"
                                    style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #F6BD2B;">
                                    Go to the Laboratory to see more details.
                                    </td>
                                </tr>
                                </table>
                            </body>`,
		};

		const mailResponse = await transporter.sendMail(mailOptions);
		return mailResponse;
	} catch (error) {
		throw new Error(error.message);
	}
};
export default sendEmail;
