import { useState } from "react";
import { createPaste } from "../Api/api.js";
import Toast from "../components/Toast.jsx";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    try {
      const payload = {
        content,
        ...(ttl && { ttl_seconds: Number(ttl) }),
        ...(views && { max_views: Number(views) })
      };

      const res = await createPaste(payload);
      // Use the URL from the server response (which should be a global URL)
      setResult(res.url);
      setContent("");
      setTtl("");
      setViews("");
      showToast("Paste created successfully!", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to create paste", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      showToast("URL copied to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy URL", "error");
      console.log(err);
      
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="w-full max-w-3xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Pastebin Lite</h1>
            <p className="text-slate-300">Create and share your pastes instantly</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-200 mb-2">
                Paste Content
              </label>
              <textarea
                id="content"
                rows="12"
                placeholder="Paste your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ttl" className="block text-sm font-medium text-slate-200 mb-2">
                  TTL (seconds) <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <input
                  id="ttl"
                  type="number"
                  placeholder="e.g., 3600"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="views" className="block text-sm font-medium text-slate-200 mb-2">
                  Max Views <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <input
                  id="views"
                  type="number"
                  placeholder="e.g., 10"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Creating..." : "Create Paste"}
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-sm font-medium text-green-200 mb-2">Paste created successfully!</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={result}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded text-white text-sm font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors text-sm font-medium"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
