import { useState } from "react";

// 🔥 Read backend URL from environment (Vercel)  
// If not found, fall back to localhost for local testing
const API_BASE = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError("Please upload a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");
    setError("");
    
    try {
      const res = await fetch(`${API_BASE}/api/email/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      const data = await res.json();
      setCandidates(data.candidates || []);
      setMessage(`✓ Loaded ${data.count || 0} candidates from CSV.`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload CSV. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleSendEmails = async () => {
    if (!candidates.length) {
      setError("No candidates loaded. Please upload a CSV first.");
      return;
    }

    setSending(true);
    setMessage("");
    setError("");
    
    try {
      const res = await fetch(`${API_BASE}/api/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidates }),
      });

      if (!res.ok) {
        throw new Error(`Send failed: ${res.statusText}`);
      }

      const data = await res.json();
      setMessage(data.message || "✓ Emails sent successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error sending emails. Check console for details.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2 text-slate-800">
          📩 Candidate Test Link Sender
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Upload a CSV with columns <span className="font-mono bg-slate-100 px-1 rounded">Name</span>,{" "}
          <span className="font-mono bg-slate-100 px-1 rounded">Email</span>,{" "}
          <span className="font-mono bg-slate-100 px-1 rounded">Test_Link</span>. Then send personalized
          test links to all candidates with one click.
        </p>

        {/* Upload Section */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 mb-6 text-center hover:border-slate-400 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csvInput"
            disabled={uploading}
          />
          <label
            htmlFor="csvInput"
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploading 
                ? "bg-slate-400 text-white cursor-not-allowed" 
                : "bg-slate-800 text-white hover:bg-slate-900"
            }`}
          >
            {uploading ? "⏳ Uploading..." : "📤 Click to upload CSV"}
          </label>
          <p className="mt-2 text-xs text-slate-500">
            CSV format: Name, Email, Test_Link
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Candidates Table */}
        {candidates.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-slate-700 mb-2">
              📋 Candidates ({candidates.length})
            </h2>
            <div className="max-h-64 overflow-auto border rounded-lg shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 sticky top-0">
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
                        {c.Name || c.name || "-"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {c.Email || c.email || "-"}
                      </td>
                      <td className="px-3 py-2">
                        <a
                          href={c.Test_Link || c.test_link || c.testLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {c.Test_Link || c.test_link || c.testLink || "-"}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Send Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSendEmails}
            disabled={sending || !candidates.length}
            className={`px-6 py-2.5 rounded-md text-sm font-medium text-white transition-colors ${
              sending || !candidates.length
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            {sending ? "⏳ Sending..." : "📧 Send Test Links"}
          </button>

          {candidates.length > 0 && !sending && (
            <p className="text-xs text-slate-600">
              Ready to send to {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-xs text-slate-500 border-t pt-4">
          <h3 className="font-semibold mb-2 text-slate-700">📖 How to use:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Prepare a CSV with columns: <span className="font-mono">Name</span>, <span className="font-mono">Email</span>, <span className="font-mono">Test_Link</span>.</li>
            <li>Upload the CSV using the button above.</li>
            <li>Review the candidate list in the table.</li>
            <li>Click "Send Test Links" to email all candidates.</li>
          </ol>
          <p className="mt-3 text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
            ⚠️ <strong>Note:</strong> Configure your Gmail App Password in{" "}
            <span className="font-mono">backend/.env</span> before sending emails.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
