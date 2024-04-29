/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import nodemailer from 'nodemailer';
import db from '@/lib/db';
import { hash } from 'bcrypt';

export const sendEmail = async ({ email, emailType }) => {
	try {
		const hashedToken = await hash(email.toString(), 12);

		const updatedUser = await db.User.update({
			where: {
				email: email,
			},
			data: {
				verifiedToken: hashedToken,
				tokenExpiry: new Date(new Date().getTime() + 86400000),
			},
		});

		const transporter = nodemailer.createTransport({
			host: process.env.HOST_SMTP,
			port: process.env.PORT_SMTP,
			auth: {
				user: process.env.USER_SMTP,
				pass: process.env.PWD_SMTP,
			},
		});

		const mailOptions =
			emailType === 'TEACHER'
				? {
						from: process.env.USER_SMTP,
						to: process.env.USER_SMTP,
						subject: 'Teacher Pending Verification',
						html: `<body style="background: #f9f9f9;">
                        <table width="100%" border="0" cellspacing="20" cellpadding="0"
                        style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
                        <tr>
                            <td align="center"
                            style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #000000;">
                            Requested Teacher Verification from: <strong>${email}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                <td align="center" style="border-radius: 5px;" bgcolor="#14287A"><a href="${process.env.DOMAIN}"
                                    target="_blank"
                                    style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #14287A; display: inline-block; font-weight: bold;">Go to Remote Lab</a></td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center"
                            style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #F6BD2B;">
                            Please, Don't forget to Review it
                            </td>
                        </tr>
                        </table>
                    </body>`,
				  }
				: {
						from: process.env.USER_SMTP,
						to: email,
						subject:
							emailType == 'PASSWORD'
								? 'Reset your Password'
								: 'Verify your Email',
						html: `<body style="background: #f9f9f9;">
                                <table width="100%" border="0" cellspacing="20" cellpadding="0"
                                style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
                                <tr>
                                    <td align="center"
                                    style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #000000;">
                                    ${
																			emailType == 'PASSWORD'
																				? 'Reset your Password in'
																				: 'Verify your Email in'
																		} <strong>UPB Solar Remote Lab</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                        <td align="center" style="border-radius: 5px;" bgcolor="#14287A"><a href="${
																					process.env.DOMAIN
																				}/${
							emailType == 'PASSWORD' ? 'forgotpassword' : 'verifyemail'
						}?token=${hashedToken}"
                                            target="_blank"
                                            style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #14287A; display: inline-block; font-weight: bold;">${
																							emailType == 'PASSWORD'
																								? 'Reset'
																								: 'Verify'
																						}</a></td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center"
                                    style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #F6BD2B;">
                                    If you did not request this email you can safely ignore it.
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
