import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// NOTE: Configure this with your actual email service provider (SendGrid, Mailgun, etc.)
// For development, you can use a service like Mailtrap.io or an Ethereal test account.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    // In a real app, you'd have more robust error handling/logging
    throw new Error("Could not send password reset email.");
  }
};