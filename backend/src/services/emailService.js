import transporter from "../config/mailConfig.js";

/**
 * Sends personalized emails to all candidates.
 * Expects candidate objects with Name, Email, Test_Link fields.
 */
export default async function sendBulkEmail(candidates) {
  let sent = 0;
  const failed = [];

  for (const c of candidates) {
    const name = c.Name || c.name;
    const email = c.Email || c.email;
    const testLink = c.Test_Link || c.test_link || c.testLink;

    if (!email || !testLink) {
      failed.push({ candidate: c, reason: "Missing email or test link" });
      continue;
    }

    const mailOptions = {
      from: `"Talent Acquisition" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Online Assessment Link",
      html: `
        <p>Dear ${name || "Candidate"},</p>
        <p>Thank you for your interest. Please use the link below to complete your assessment:</p>
        <p><a href="${testLink}" target="_blank">${testLink}</a></p>
        <p>Please complete the test within the given timeframe.</p>
        <p>Best regards,<br/>HR / Talent Acquisition Team</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      sent += 1;
    } catch (err) {
      failed.push({ candidate: c, reason: err.message });
    }
  }

  return { sent, failed };
}
