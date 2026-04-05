"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Charity {
  _id: string;
  name: string;
  description: string;
  mediaUrl?: string;
  featured: boolean;
  totalRaised: number;
}

export default function CharitiesPage() {
  const { data: session } = useSession();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [selectedId, setSelectedId] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = (session as any)?.accessToken;

  const fetchCharities = async () => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/charities" + q);
    const data = await res.json();
    if (Array.isArray(data)) setCharities(data);
  };

  useEffect(() => {
    fetchCharities();
  }, [search]);

  const handleSelect = async (charityId: string) => {
    if (!token) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/charities/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ charityId, percentage }),
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedId(charityId);
        setMessage("Charity selected! " + percentage + "% of your subscription will go here.");
      } else {
        setMessage(data.message || "Failed");
      }
    } catch {
      setMessage("Network error");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Choose Your Charity</h1>
        <p className="text-zinc-400 mb-8 text-sm">Select a charity to receive at least 10% of your subscription. You can increase the percentage below.</p>

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg mb-6 text-sm">{message}</div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search charities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-indigo-500 text-white"
          />
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
            <label className="text-xs text-zinc-400 whitespace-nowrap">Donate:</label>
            <input
              type="number"
              min="10"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(Math.max(10, parseInt(e.target.value) || 10))}
              className="w-16 bg-transparent border-none text-white text-center font-bold focus:outline-none"
            />
            <span className="text-zinc-400">%</span>
          </div>
        </div>

        {/* Charities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charities.length === 0 ? (
            <p className="text-zinc-500 col-span-2 text-center py-12">No charities found. Check back later or ask your admin to add some.</p>
          ) : (
            charities.map((c) => (
              <div
                key={c._id}
                className={`bg-zinc-900 rounded-3xl border p-6 transition-all relative overflow-hidden group ${
                  selectedId === c._id
                    ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {c.featured && (
                  <span className="absolute top-4 right-4 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ⭐ FEATURED
                  </span>
                )}
                <h3 className="text-lg font-bold mb-2">{c.name}</h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{c.description}</p>
                <div className="text-xs text-zinc-500 mb-4">Total Raised: £{c.totalRaised.toFixed(2)}</div>
                <button
                  onClick={() => handleSelect(c._id)}
                  disabled={saving}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                    selectedId === c._id
                      ? "bg-indigo-500 text-white"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                  }`}
                >
                  {selectedId === c._id ? "✓ Selected" : "Select This Charity"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
