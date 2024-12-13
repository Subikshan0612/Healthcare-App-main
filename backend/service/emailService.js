// service/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Yahoo', // Using Yahoo Mail as the email service
    auth: {
        user: process.env.EMAIL_USER, // Your Yahoo email address
        pass: process.env.EMAIL_PASS,  // Your Yahoo email password
    },
});

const sendEmailNotification = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Your Yahoo email address
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmailNotification };
