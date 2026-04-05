"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  activeSubscribers: number;
  totalCharities: number;
  totalPrizePoolDistributed: number;
  totalCharityRaised: number;
  totalDraws: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken;
  const role = (session?.user as any)?.role;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || role !== "ADMIN") return;
    
    const fetchStats = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [token, role]);

  if (status === "loading" || (role === "ADMIN" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Access Denied</h2>
          <p className="text-zinc-400 mb-6">Admin privileges required.</p>
          <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 font-medium font-sans">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const panels = [
    { title: "User Management", desc: "View/edit user profiles, scores, and subscriptions", href: "/admin/users", icon: "👥", color: "emerald", border: "border-emerald-500/20", glow: "group-hover:bg-emerald-500/5" },
    { title: "Draw Management", desc: "Create, simulate, and publish monthly draws", href: "/admin/draws", icon: "🎱", color: "teal", border: "border-teal-500/20", glow: "group-hover:bg-teal-500/5" },
    { title: "Charity Management", desc: "Add, edit, and manage charity listings", href: "/admin/charities", icon: "❤️", color: "indigo", border: "border-indigo-500/20", glow: "group-hover:bg-indigo-500/5" },
    { title: "Winner Verification", desc: "Review proofs, approve or reject, mark payouts", href: "/admin/winners", icon: "🏆", color: "yellow", border: "border-yellow-500/20", glow: "group-hover:bg-yellow-500/5" },
  ];

  const metricCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, color: "text-zinc-100" },
    { label: "Active Subs", value: stats?.activeSubscribers || 0, color: "text-emerald-400" },
    { label: "Charity Raised", value: `£${stats?.totalCharityRaised.toFixed(2)}` || "£0.00", color: "text-indigo-400" },
    { label: "Prize Distributed", value: `£${stats?.totalPrizePoolDistributed.toFixed(2)}` || "£0.00", color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors">← Back to Dashboard</Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Admin <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Overview</span></h1>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Reports & Analytics Engine</p>
        </header>

        {/* Analytics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {metricCards.map((m, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden">
               <div className="relative z-10">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{m.label}</p>
                <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
               </div>
               <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
            </div>
          ))}
        </div>

        {/* Management Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {panels.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`bg-zinc-900 border ${p.border} rounded-[2rem] p-8 hover:border-zinc-500 transition-all group relative overflow-hidden shadow-2xl`}
            >
              <div className={`absolute inset-0 ${p.glow} transition-colors`}></div>
              <div className="relative z-10">
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{p.icon}</div>
                <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-white transition-colors">{p.title}</h2>
                <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
