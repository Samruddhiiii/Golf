"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Winning {
  _id: string;
  drawId: {
    _id: string;
    month: number;
    year: number;
    winningNumbers: number[];
  };
  payoutAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  proofImageUrl?: string;
}

export default function WinningsPage() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken;
  const [winnings, setWinnings] = useState<Winning[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedWinningId, setSelectedWinningId] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [message, setMessage] = useState("");

  const fetchWinnings = async () => {
    if (!token) return;
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/winners/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setWinnings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchWinnings();
  }, [token, status]);

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage("");

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/winners/proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          drawId: selectedWinningId,
          proofImageUrl: proofUrl,
        }),
      });

      if (res.ok) {
        setMessage("Proof submitted successfully! Admin will review it soon.");
        setProofUrl("");
        setSelectedWinningId("");
        fetchWinnings();
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to submit proof");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setUploading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">Your Winnings</h1>
        <p className="text-zinc-400 mb-10 text-sm">Review your prize history and upload proof for pending payouts.</p>

        {message && (
          <div className={`p-4 rounded-xl mb-8 text-sm border ${
            message.includes("success") ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-red-500/10 border-red-500/50 text-red-400"
          }`}>
            {message}
          </div>
        )}

        {/* Upload Form (only if selected) */}
        {selectedWinningId && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-bold mb-4">Upload Verification Proof</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              To verify your win, please upload a screenshot of your Stableford scores from your golf application (e.g. Golf Genius, VPAR, etc).
            </p>
            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Screenshot URL (Mock Integration)</label>
                <input
                  type="text"
                  placeholder="https://example.com/screenshot.png"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-yellow-500 text-sm transition-all"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-3.5 rounded-2xl transition-all disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Submit Proof"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWinningId("")}
                  className="px-6 rounded-2xl border border-zinc-800 hover:bg-zinc-800/50 text-zinc-400 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Winnings List */}
        {winnings.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 mt-8">
            <div className="text-5xl mb-4">🏆</div>
            <p>You haven't won anything yet. Keep playing and supporting charities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {winnings.map((w) => (
              <div key={w._id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group hover:border-zinc-700 transition-all shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-white">£{w.payoutAmount?.toFixed(2)}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-widest ${
                        w.status === "PAID" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
                        w.status === "APPROVED" ? "text-blue-400 border-blue-500/30 bg-blue-500/10" :
                        w.status === "REJECTED" ? "text-red-400 border-red-500/30 bg-red-500/10" :
                        "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                      }`}>{w.status}</span>
                    </div>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Draw {w.drawId?.month}/{w.drawId?.year}</p>
                    <div className="flex gap-1.5 mt-4">
                      {w.drawId?.winningNumbers?.map((n: number, i: number) => (
                        <span key={i} className="h-7 w-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-bold font-mono text-zinc-400">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {!w.proofImageUrl && w.status === "PENDING" && (
                      <button
                        onClick={() => setSelectedWinningId(w.drawId._id)}
                        className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-3 rounded-2xl font-bold text-sm transition-all"
                      >
                        Upload Proof
                      </button>
                    )}
                    {w.proofImageUrl && (
                      <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Proof Uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
