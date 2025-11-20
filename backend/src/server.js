import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Email Trigger Backend is running" });
});

app.use("/api/email", emailRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on PORT ${PORT}`);
});

