import fs from "fs";
import csv from "csv-parser";
import sendBulkEmail from "../services/emailService.js";

let candidates = [];

/**
 * POST /api/email/upload
 * Expects a CSV with columns: Name, Email, Test_Link
 */
export const uploadList = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", () => {
      candidates = results;
      fs.unlink(filePath, () => {});
      return res.json({
        success: true,
        count: candidates.length,
        candidates,
      });
    })
    .on("error", (err) => {
      return res
        .status(500)
        .json({ success: false, message: "Error reading CSV", error: err.message });
    });
};

/**
 * POST /api/email/send
 * Sends emails using the in-memory candidate list
 */
export const sendEmails = async (_req, res) => {
  if (!candidates.length) {
    return res.status(400).json({
      success: false,
      message: "No candidates loaded. Upload a CSV first.",
    });
  }

  try {
    const result = await sendBulkEmail(candidates);
    return res.json({
      success: true,
      message: `Emails sent to ${result.sent} candidates`,
      failed: result.failed,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to send some emails", error: err.message });
  }
};
