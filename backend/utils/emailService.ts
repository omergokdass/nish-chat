import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendVerificationEmail = async (email: string, code: string) => {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.error("EMAIL SERVICE ERROR: MAIL_USER or MAIL_PASS is missing in .env");
        return false;
    }

    try {
        const mailOptions = {
            from: `"Nish Chat" <${process.env.MAIL_USER}>`,
            to: email,
            replyTo: process.env.MAIL_USER,
            subject: "Verification Code: " + code,
            text: `Your verification code is: ${code}\n\nThis code expires in 15 minutes.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: ", info.messageId);
        console.log("Full response: ", info.response);
        return true;
    } catch (error) {
        console.error("Failed to send email: ", error);
        return false;
    }
};
