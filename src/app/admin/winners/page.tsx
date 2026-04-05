"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminWinners() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [verifications, setVerifications] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const fetchVerifications = async () => {
    if (!token) return;
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/winners", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setVerifications(data);
  };

  useEffect(() => { fetchVerifications(); }, [token]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/winners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setMessage(`Verification ${status.toLowerCase()}.`);
      fetchVerifications();
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "PENDING": return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      case "APPROVED": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "REJECTED": return "text-red-400 border-red-500/30 bg-red-500/10";
      case "PAID": return "text-blue-400 border-blue-500/30 bg-blue-500/10";
      default: return "text-zinc-400 border-zinc-700 bg-zinc-800";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors">← Back to Admin</Link>
        <h1 className="text-3xl font-bold mb-8">Winner Verification</h1>

        {message && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg mb-6 text-sm">{message}</div>}

        {verifications.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">No winner verifications yet.</div>
        ) : (
          <div className="space-y-4">
            {verifications.map((v) => (
              <div key={v._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{v.userId?.name || "Unknown"} <span className="text-zinc-500 font-normal text-sm">({v.userId?.email})</span></h3>
                    <p className="text-zinc-400 text-sm mt-1">Draw: {v.drawId?.month}/{v.drawId?.year}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full border ${statusColor(v.status)}`}>{v.status}</span>
                    {v.proofImageUrl && (
                      <a href={v.proofImageUrl} target="_blank" rel="noopener" className="block mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline">View Proof Screenshot</a>
                    )}
                  </div>
                  <div className="flex gap-2 items-start flex-shrink-0">
                    {v.status === "PENDING" && (
                      <>
                        <button onClick={() => updateStatus(v._id, "APPROVED")} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl text-sm font-bold transition-all">Approve</button>
                        <button onClick={() => updateStatus(v._id, "REJECTED")} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-sm font-medium transition-all">Reject</button>
                      </>
                    )}
                    {v.status === "APPROVED" && (
                      <button onClick={() => updateStatus(v._id, "PAID")} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">Mark Paid</button>
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
