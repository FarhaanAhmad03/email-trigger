import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const uploadCSV = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.match(/\.csv$/i)) {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
});

export default uploadCSV;
