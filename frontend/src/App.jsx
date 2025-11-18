import { useState } from "react";
import axios from "axios";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/email/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCandidates(res.data.candidates || []);
      setMessage(`Loaded ${res.data.count || 0} candidates from CSV.`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload CSV. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleSendEmails = async () => {
    if (!candidates.length) {
      setMessage("No candidates loaded. Please upload a CSV first.");
      return;
    }

    setSending(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/email/send");
      setMessage(res.data.message || "Emails sent.");
    } catch (err) {
      console.error(err);
      setMessage("Error sending emails. Check console for details.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2 text-slate-800">
          📩 Candidate Test Link Sender
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Upload a CSV with columns <span className="font-mono">Name</span>,{" "}
          <span className="font-mono">Email</span>,{" "}
          <span className="font-mono">Test_Link</span>. Then send personalized
          test links to all candidates with one click.
        </p>

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 mb-6 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csvInput"
          />
          <label
            htmlFor="csvInput"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-800 text-white text-sm font-medium hover:bg-slate-900"
          >
            {uploading ? "Uploading..." : "Click to upload CSV"}
          </label>
          <p className="mt-2 text-xs text-slate-500">
            CSV format: Name, Email, Test_Link
          </p>
        </div>

        {candidates.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-slate-700 mb-2">
              Candidates ({candidates.length})
            </h2>
            <div className="max-h-64 overflow-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">
                      Test Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {c.Name || c.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {c.Email || c.email}
                      </td>
                      <td className="px-3 py-2">
                        <a
                          href={c.Test_Link || c.test_link || c.testLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline break-all"
                        >
                          {c.Test_Link || c.test_link || c.testLink}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handleSendEmails}
            disabled={sending || !candidates.length}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              sending || !candidates.length
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {sending ? "Sending..." : "Send Test Links"}
          </button>

          {message && (
            <p className="text-xs text-slate-600 max-w-md text-right">
              {message}
            </p>
          )}
        </div>

        <div className="mt-6 text-xs text-slate-500 border-t pt-4">
          <h3 className="font-semibold mb-1">How to use:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Prepare a CSV with columns: Name, Email, Test_Link.</li>
            <li>Upload the CSV using the button above.</li>
            <li>Review the candidate list.</li>
            <li>Click “Send Test Links” to email all candidates.</li>
          </ol>
          <p className="mt-2">
            Note: Configure your Gmail App Password in{" "}
            <span className="font-mono">backend/.env</span> before sending.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
