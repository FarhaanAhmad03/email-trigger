import express from "express";
import uploadCSV from "../middleware/uploadCSV.js";
import { uploadList, sendEmails } from "../controllers/emailController.js";

const router = express.Router();

// Upload CSV and parse candidates
router.post("/upload", uploadCSV.single("file"), uploadList);

// Trigger sending emails to all parsed candidates
router.post("/send", sendEmails);

export default router;
