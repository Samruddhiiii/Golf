"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
           setError("Registration successful, but auto-login failed. Please log in manually.");
           setLoading(false);
        } else {
           router.push("/dashboard");
        }
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
        setLoading(false);
      }
    } catch (err) {
      setError("A network error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Join the Impact</h2>
        <p className="text-zinc-400 text-center mb-8">Create an account to support charities and enter the monthly draw.</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-300">Name</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-300">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="golfer@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-300">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
         <p className="mt-6 text-center text-zinc-400 text-sm">
          Already have an account? <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  );
}
