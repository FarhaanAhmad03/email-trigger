# EMAIL-TRIGGER

Full-stack app to upload a CSV of candidates and send each of them a personalized test link via email.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + Nodemailer (Gmail SMTP)
- File Uploads: multer, CSV parsing with csv-parser

## Project Structure

EMAIL-TRIGGER/
- frontend/      React app (Vite)
- backend/       Express API
- uploads/       Temporary CSV storage (server side)

---

## Getting Started

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set:

```env
PORT=5000
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

> For Gmail, create an App Password in Google Account → Security.

Run backend:

```bash
npm run dev
```

### 2. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will start the app (default: http://localhost:5173).

---

## Usage

1. Prepare a CSV file with headers:

```csv
Name,Email,Test_Link
Alice,alice@example.com,https://testlink1.com
Bob,bob@example.com,https://testlink2.com
```

2. Open the frontend in your browser.
3. Upload the CSV file.
4. Review loaded candidates.
5. Click **“Send Test Links”**.

The backend will send personalized emails to each candidate using the template in `backend/src/services/emailService.js`.

---

## Deploying

- **Backend**: Deploy to Render / Railway / any Node hosting.
- **Frontend**: Deploy to Vercel / Netlify.
- Update the frontend API base URL (currently `http://localhost:5000`) in `App.jsx` when deploying.

