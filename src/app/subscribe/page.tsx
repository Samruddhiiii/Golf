"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Subscribe() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
        body: JSON.stringify({ plan: selected }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Subscription failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">
        <div className="text-center bg-zinc-900 border border-zinc-800 rounded-3xl p-12 max-w-md">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">You're In!</h2>
          <p className="text-zinc-400 mb-8">Your subscription is active. Enter your scores and start winning.</p>
          <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-3 rounded-xl font-bold transition-all">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors">← Back to Home</Link>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Choose Your Plan</h1>
        <p className="text-zinc-400 mb-12">Subscribe to enter the monthly draw and support a charity of your choice.</p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Monthly */}
          <button
            onClick={() => setSelected("MONTHLY")}
            className={`p-8 rounded-3xl border-2 text-left transition-all ${
              selected === "MONTHLY"
                ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            <div className="text-sm font-medium text-zinc-400 mb-2">Monthly</div>
            <div className="text-4xl font-extrabold mb-1">£9.99<span className="text-lg font-normal text-zinc-500">/mo</span></div>
            <ul className="text-zinc-400 text-sm mt-4 space-y-2">
              <li>✓ Monthly draw entry</li>
              <li>✓ Score tracking</li>
              <li>✓ 10%+ to charity</li>
              <li>✓ Cancel anytime</li>
            </ul>
          </button>

          {/* Yearly */}
          <button
            onClick={() => setSelected("YEARLY")}
            className={`p-8 rounded-3xl border-2 text-left transition-all relative ${
              selected === "YEARLY"
                ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            <div className="absolute -top-3 right-6 bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full">SAVE 20%</div>
            <div className="text-sm font-medium text-zinc-400 mb-2">Yearly</div>
            <div className="text-4xl font-extrabold mb-1">£95.88<span className="text-lg font-normal text-zinc-500">/yr</span></div>
            <div className="text-xs text-emerald-400 mb-1">That's £7.99/mo</div>
            <ul className="text-zinc-400 text-sm mt-4 space-y-2">
              <li>✓ All monthly perks</li>
              <li>✓ Priority support</li>
              <li>✓ Best value</li>
            </ul>
          </button>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(16,185,129,0.3)]"
        >
          {loading ? "Processing..." : `Subscribe — ${selected === "MONTHLY" ? "£9.99/mo" : "£95.88/yr"}`}
        </button>
        <p className="text-zinc-500 text-xs text-center mt-4">Mock Stripe — no real charges will be made.</p>
      </div>
    </div>
  );
}
