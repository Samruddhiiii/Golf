"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken;
  const role = (session?.user as any)?.role;

  const [sub, setSub] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [winnings, setWinnings] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/subscriptions/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => setSub(d)).catch(() => {});

    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/scores", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => setScores(d.scores || [])).catch(() => {});

    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/winners/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => { if (Array.isArray(d)) setWinnings(d); }).catch(() => {});
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-zinc-400 mb-6">You must be logged in to view your dashboard.</p>
          <Link href="/login" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-2 rounded-xl font-bold transition-colors">Log In</Link>
        </div>
      </div>
    );
  }

  const isActive = sub?.status === "ACTIVE";
  const totalWon = winnings.reduce((sum: number, w: any) => sum + (w.payoutAmount || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Welcome, <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">{session?.user?.name}</span>
            </h1>
            <p className="text-zinc-400 text-sm">Review your impact and upcoming draws.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {role === "ADMIN" && (
              <Link href="/admin" className="px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl font-medium text-sm transition-all">
                Admin Panel
              </Link>
            )}
            <button onClick={() => signOut({ callbackUrl: '/' })} className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium text-sm border border-zinc-700 transition-all">
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Subscription Card */}
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-all"></div>
            <h2 className="text-xl font-semibold mb-2 text-white">Subscription</h2>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-4 border ${
              isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-zinc-800 text-zinc-300 border-zinc-700"
            }`}>
              {isActive ? "Active" : "Inactive"}
            </div>
            {isActive ? (
              <div>
                <p className="text-zinc-400 text-sm mb-1">Plan: <span className="text-white font-medium">{sub.plan}</span></p>
                <p className="text-zinc-400 text-sm mb-4">Renews: {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-zinc-400 mb-6 text-sm">Subscribe to enter the draw and support charity!</p>
            )}
            <Link href="/subscribe" className="block text-center bg-emerald-500 hover:bg-emerald-400 w-full py-3 rounded-xl text-zinc-950 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {isActive ? "Manage Plan" : "Subscribe Now"}
            </Link>
          </div>

          {/* Scores Card */}
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden group hover:border-teal-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-teal-500/10 transition-all"></div>
            <h2 className="text-xl font-semibold mb-4 text-white">Your Draw Numbers</h2>
            <div className="flex gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-12 w-12 rounded-xl flex items-center justify-center font-mono text-lg font-bold border transition-all ${
                  scores[i] ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-zinc-800 border-zinc-700 text-zinc-600"
                }`}>
                  {scores[i]?.value ?? "-"}
                </div>
              ))}
            </div>
            <Link href="/scores" className="block text-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 w-full py-3 rounded-xl text-white font-medium transition-all">
              Manage Scores
            </Link>
          </div>

          {/* Charity Card */}
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all lg:col-span-1 md:col-span-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-all"></div>
            <h2 className="text-xl font-semibold mb-2 text-white">Your Impact</h2>
            <p className="text-zinc-400 mb-6 text-sm">Choose a charity and set your contribution percentage.</p>
            <Link href="/charities" className="block text-center bg-indigo-500 hover:bg-indigo-400 w-full py-3 rounded-xl text-white font-bold transition-all">
              Choose Charity
            </Link>
          </div>

          {/* Winnings Card */}
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden group hover:border-yellow-500/30 transition-all md:col-span-2 lg:col-span-3">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-white">🏆 Winnings Overview</h2>
              <Link href="/winnings" className="text-xs font-bold text-yellow-500 hover:text-yellow-400 uppercase tracking-widest transition-colors">
                View All & Upload Proof →
              </Link>
            </div>
            {winnings.length === 0 ? (
              <p className="text-zinc-400 text-sm">No winnings yet. Enter your scores and subscribe to compete!</p>
            ) : (
              <div>
                <p className="text-zinc-300 mb-6 text-2xl font-black">Total Won: <span className="text-yellow-400">£{totalWon.toFixed(2)}</span></p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {winnings.slice(0, 3).map((w, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50 text-sm hover:border-zinc-700 transition-all">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Draw {w.drawId?.month}/{w.drawId?.year}</p>
                        <p className="font-bold text-white">£{w.payoutAmount?.toFixed(2)}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider ${
                        w.status === "PAID" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
                        w.status === "APPROVED" ? "text-blue-400 border-blue-500/30 bg-blue-500/10" :
                        "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                      }`}>{w.status}</span>
                    </div>
                  ))}
                  {winnings.length > 3 && (
                    <div className="flex items-center justify-center p-4 bg-zinc-950/50 rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-xs">
                      + {winnings.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
