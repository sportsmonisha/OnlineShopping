const nodemailer = require('nodemailer');

const sendEmail = async options => {
    try {
        const transport = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for port 587, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false, // this allows self-signed certificates
                minVersion: 'TLSv1.2' // Ensure using at least TLS 1.2
            }
        };

        const transporter = nodemailer.createTransport(transport);

        const message = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message
        };
        
        await transporter.sendMail(message);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_FROM_NAME:', process.env.SMTP_FROM_NAME);
console.log('SMTP_FROM_EMAIL:', process.env.SMTP_FROM_EMAIL);

};

module.exports = sendEmail;
