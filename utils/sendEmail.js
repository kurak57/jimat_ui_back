import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: {
                name: 'Jimat UI',
                address: process.env.EMAIL_USER,
            },
            to: email,
            subject: subject,
            text: text,
        });

        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Email not sent!");
        console.error(error);
        throw error; // Re-throw the error for proper handling elsewhere
    }
};

export default sendEmail;
