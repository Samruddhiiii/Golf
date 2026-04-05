"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCharities() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [charities, setCharities] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCharities = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/charities");
    const data = await res.json();
    if (Array.isArray(data)) setCharities(data);
  };

  useEffect(() => { fetchCharities(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage("");
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/charities", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description, featured }),
    });
    if (res.ok) {
      setMessage("Charity created!");
      setName("");
      setDescription("");
      setFeatured(false);
      fetchCharities();
    } else {
      const data = await res.json();
      setMessage(data.message || "Error");
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/charities/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchCharities();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors">← Back to Admin</Link>
        <h1 className="text-3xl font-bold mb-8">Charity Management</h1>

        {message && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg mb-6 text-sm">{message}</div>}

        {/* Create */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Charity</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" placeholder="Charity Name" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500" />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 resize-none" />
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-emerald-500" />
              Featured charity
            </label>
            <button type="submit" disabled={creating}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50">
              {creating ? "Creating..." : "Add Charity"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-4">
          {charities.map((c) => (
            <div key={c._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold">{c.name} {c.featured && <span className="text-yellow-400 text-xs ml-2">⭐ Featured</span>}</h3>
                <p className="text-zinc-400 text-sm mt-1 line-clamp-1">{c.description}</p>
                <p className="text-zinc-500 text-xs mt-1">Raised: £{c.totalRaised?.toFixed(2)}</p>
              </div>
              <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
