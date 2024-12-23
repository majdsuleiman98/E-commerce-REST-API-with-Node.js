const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function generateOTP() {
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
    return [crypto.randomInt(100000, 999999).toString(), otpExpiry];
}

async function sendOTP(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification OTP',
        html: `Your OTP for email verification is: <b>${otp}</b>.<br>This OTP will expire in <b>10</b> minutes.`,
    };
    await transporter.sendMail(mailOptions);
}

module.exports = { generateOTP, sendOTP };
