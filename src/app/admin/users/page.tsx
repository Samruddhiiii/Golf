"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken;
  const currentRole = (session?.user as any)?.role;
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && currentRole === "ADMIN") {
      fetchUsers();
    }
  }, [token, status, currentRole]);

  const toggleRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/auth/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        fetchUsers(); // Refresh list
      }
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (currentRole !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Access Denied</h2>
          <p className="text-zinc-400 mb-6">Admin privileges required.</p>
          <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 font-medium">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors">← Back to Admin</Link>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-zinc-400 mb-8">Manage users and roles on the platform.</p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="p-4 text-xs text-zinc-400 font-bold uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs text-zinc-400 font-bold uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs text-zinc-400 font-bold uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs text-zinc-400 font-bold uppercase tracking-wider">Joined</th>
                  <th className="p-4 text-xs text-zinc-400 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
                    <td className="p-4 font-medium text-white">{u.name}</td>
                    <td className="p-4 text-zinc-400 text-sm">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide ${
                        u.role === "ADMIN" ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" : "text-zinc-400 border-zinc-700 bg-zinc-800/50"
                      }`}>{u.role}</span>
                    </td>
                    <td className="p-4 text-zinc-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleRole(u._id, u.role === "ADMIN" ? "USER" : "ADMIN")}
                        className="text-[10px] font-bold text-zinc-400 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                        disabled={u._id === (session?.user as any)?.id}
                      >
                        {u.role === "ADMIN" ? "Demote" : "Promote"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
