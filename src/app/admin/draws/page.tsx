"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDraws() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [draws, setDraws] = useState<any[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [creating, setCreating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);
  const [message, setMessage] = useState("");

  const fetchDraws = async () => {
    if (!token) return;
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/draws", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setDraws(data);
  };

  useEffect(() => { fetchDraws(); }, [token]);

  const handleCreate = async () => {
    setCreating(true);
    setMessage("");
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/draws", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ month, year }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Draw created!");
      fetchDraws();
    } else {
      setMessage(data.message || "Error");
    }
    setCreating(false);
  };

  const handleSimulate = async (id: string) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/draws/${id}/simulate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSimResult(data);
  };

  const handlePublish = async (id: string) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/draws/${id}/publish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setMessage("Draw published!");
      setSimResult(null);
      fetchDraws();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors">← Back to Admin</Link>
        <h1 className="text-3xl font-bold mb-8">Draw Management</h1>

        {message && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg mb-6 text-sm">{message}</div>}

        {/* Create Draw */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Draw</h2>
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Month</label>
              <input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(parseInt(e.target.value))}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white w-24 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Year</label>
              <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white w-28 focus:outline-none focus:border-emerald-500" />
            </div>
            <button onClick={handleCreate} disabled={creating}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50">
              {creating ? "Creating..." : "Create Draw"}
            </button>
          </div>
        </div>

        {/* Simulation Result */}
        {simResult && (
          <div className="bg-zinc-900 border border-teal-500/30 rounded-3xl p-8 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-teal-400">🎲 Simulation Result</h2>
            <div className="flex gap-2 mb-4">
              {simResult.winningNumbers?.map((n: number, i: number) => (
                <div key={i} className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold font-mono">{n}</div>
              ))}
            </div>
            <p className="text-zinc-400 text-sm mb-2">Prize Pool: £{simResult.prizePool?.toFixed(2)}</p>
            <p className="text-zinc-400 text-sm">5-Match: {simResult.breakdown?.jackpot?.winners} winners | 4-Match: {simResult.breakdown?.fourMatch?.winners} | 3-Match: {simResult.breakdown?.threeMatch?.winners}</p>
          </div>
        )}

        {/* Draws List */}
        <div className="space-y-4">
          {draws.map((d) => (
            <div key={d._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg">{d.month}/{d.year}</h3>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    d.status === "PUBLISHED" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
                    d.status === "SIMULATION" ? "text-teal-400 border-teal-500/30 bg-teal-500/10" :
                    "text-zinc-400 border-zinc-700 bg-zinc-800"
                  }`}>{d.status}</span>
                  <span className="text-xs text-zinc-500">Pool: £{d.totalPrizePool?.toFixed(2)}</span>
                </div>
                {d.winningNumbers?.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {d.winningNumbers.map((n: number, i: number) => (
                      <span key={i} className="text-xs bg-zinc-800 px-2 py-1 rounded font-mono">{n}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {d.status !== "PUBLISHED" && (
                  <>
                    <button onClick={() => handleSimulate(d._id)} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl text-sm font-medium transition-all">Simulate</button>
                    <button onClick={() => handlePublish(d._id)} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl text-sm font-bold transition-all">Publish</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
