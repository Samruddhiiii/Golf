"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Score {
  _id: string;
  value: number;
  date: string;
  enteredAt: string;
}

export default function ScoresPage() {
  const { data: session } = useSession();
  const [scores, setScores] = useState<Score[]>([]);
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = (session as any)?.accessToken;

  const fetchScores = async () => {
    if (!token) return;
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/scores", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setScores(data.scores || []);
  };

  useEffect(() => {
    fetchScores();
  }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const numVal = parseInt(value);
    if (numVal < 1 || numVal > 45) {
      setError("Score must be between 1 and 45.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: numVal, date }),
      });
      const data = await res.json();
      if (res.ok) {
        setScores(data.scores);
        setValue("");
        setDate("");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">Your Golf Scores</h1>
        <p className="text-zinc-400 mb-8 text-sm">Enter your Stableford scores (1–45). Only your latest 5 are kept as your draw numbers.</p>

        {/* Score Display */}
        <div className="flex gap-3 mb-10 justify-center">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-16 w-16 rounded-2xl flex items-center justify-center font-mono text-xl font-bold border transition-all ${
                scores[i]
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-600"
              }`}
            >
              {scores[i]?.value ?? "-"}
            </div>
          ))}
        </div>

        {/* Add Score Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Score</h2>
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Stableford Score</label>
              <input
                type="number"
                min="1"
                max="45"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-emerald-500 text-white"
                placeholder="1–45"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Date Played</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? "..." : "Add"}
              </button>
            </div>
          </form>
        </div>

        {/* Score History */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-lg font-semibold mb-4">Score History</h2>
          {scores.length === 0 ? (
            <p className="text-zinc-500 text-sm">No scores yet. Add your first one above.</p>
          ) : (
            <div className="space-y-3">
              {scores.map((s, i) => (
                <div key={s._id || i} className="flex justify-between items-center p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
                      {s.value}
                    </div>
                    <span className="text-zinc-400 text-sm">{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                  <span className="text-zinc-600 text-xs">#{i + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
