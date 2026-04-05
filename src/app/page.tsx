"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [featuredCharities, setFeaturedCharities] = useState<any[]>([]);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/charities?featured=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeaturedCharities(data.slice(0, 4));
        }
      })
      .catch((err) => console.error("Failed to fetch featured charities", err));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            GolfImpact
          </h1>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">
              Log In
            </Link>
            <Link
              href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-2 rounded-xl text-sm font-bold transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-medium mb-8">
            🏌️ A new way to play with purpose
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Play Golf.<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Win Prizes.</span><br />
            Give Back.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Subscribe, enter your Stableford scores, and compete in a monthly draw — all while
            supporting the charities you care about most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              Start Your Impact — Subscribe
            </Link>
            <a
              href="#how-it-works"
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-8 py-3.5 rounded-xl font-medium text-base transition-all"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-zinc-400 text-center mb-16 max-w-lg mx-auto">Three simple steps to make every round of golf count.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Subscribe",
                desc: "Pick a monthly or yearly plan. A portion of your fee goes straight to your chosen charity.",
                color: "emerald",
              },
              {
                step: "02",
                title: "Enter Scores",
                desc: "Log your last 5 Stableford scores. These become your unique numbers for the monthly draw.",
                color: "teal",
              },
              {
                step: "03",
                title: "Win & Give",
                desc: "Match 3, 4, or all 5 numbers to win from the prize pool. Jackpots roll over if unclaimed!",
                color: "cyan",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative group hover:border-zinc-700 transition-all"
              >
                <span className={`text-5xl font-black text-${item.color}-500/10 absolute top-4 right-6 group-hover:text-${item.color}-500/20 transition-all`}>
                  {item.step}
                </span>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Breakdown */}
      <section className="py-24 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prize Pool Breakdown</h2>
          <p className="text-zinc-400 mb-16 max-w-lg mx-auto">Every subscriber fuels the pool. Here is how winnings are distributed each month.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-950 border border-yellow-500/30 rounded-3xl p-8">
              <div className="text-4xl font-extrabold text-yellow-400 mb-2">40%</div>
              <h3 className="text-lg font-bold mb-1">5-Number Match</h3>
              <p className="text-zinc-500 text-sm">The Jackpot. Rolls over if nobody wins.</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-700 rounded-3xl p-8">
              <div className="text-4xl font-extrabold text-zinc-300 mb-2">35%</div>
              <h3 className="text-lg font-bold mb-1">4-Number Match</h3>
              <p className="text-zinc-500 text-sm">Split equally among all 4-match winners.</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-700 rounded-3xl p-8">
              <div className="text-4xl font-extrabold text-zinc-300 mb-2">25%</div>
              <h3 className="text-lg font-bold mb-1">3-Number Match</h3>
              <p className="text-zinc-500 text-sm">Split equally among all 3-match winners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Charity Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Your Game. <span className="text-emerald-500">Their Future.</span></h2>
          <p className="text-zinc-400 mb-12 max-w-lg mx-auto">
            At least 10% of every subscription goes directly to charity. Choose who you champion when you sign up.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCharities.length > 0 ? (
              featuredCharities.map((charity, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 hover:border-emerald-500/30 transition-all cursor-pointer group shadow-xl">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                    {charity.mediaUrl ? <img src={charity.mediaUrl} alt={charity.name} className="h-12 w-12 object-contain mx-auto" /> : "❤️"}
                  </div>
                  <h4 className="font-bold text-white mb-2">{charity.name}</h4>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Charity Partner</p>
                </div>
              ))
            ) : (
                ["❤️", "🌍", "🎓", "🏥"].map((icon, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 opacity-50">
                      <div className="text-4xl mb-3">{icon}</div>
                      <p className="text-zinc-400 text-xs italic">Upcoming Partner</p>
                    </div>
                ))
            )}
          </div>
          <Link
            href="/register"
            className="inline-block mt-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            Start Your Impact — Subscribe
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">© 2026 GolfImpact by Digital Heroes. All rights reserved.</p>
          <div className="flex gap-6 text-zinc-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
