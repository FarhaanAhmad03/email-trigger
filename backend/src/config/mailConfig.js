import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn(
    "⚠️  SMTP_USER or SMTP_PASS not set. Configure them in your .env file before sending emails."
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
