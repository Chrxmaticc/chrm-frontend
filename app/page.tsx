"use client";

import { useState } from "react";
import { Terminal, Zap, Shield, Gamepad2, Music, ArrowRight } from "lucide-react";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            chrm<span className="text-gray-500">.cc</span>
          </div>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 relative flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          v1.0 alpha is now live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
          The ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">selfbot</span> engine.
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mb-10">
          Experience the most advanced Discord automation. Live lyrics, rich presence, AI integration, and zero-latency snipers.
        </p>

        <button
          onClick={() => setIsLoginOpen(true)}
          className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]"
        >
          Get Started
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-6 relative z-10">
        <FeatureCard 
          icon={<Gamepad2 className="w-6 h-6 text-indigo-400" />}
          title="Fake Play RPC"
          desc="Spoof any game with official application IDs. Look like you're grinding 24/7."
        />
        <FeatureCard 
          icon={<Music className="w-6 h-6 text-cyan-400" />}
          title="Live Lyrics Sync"
          desc="Automatically sync your Discord status with your Spotify playback."
        />
        <FeatureCard 
          icon={<Zap className="w-6 h-6 text-yellow-400" />}
          title="Instant Sniper"
          desc="Never miss a deleted message or an edited typo again."
        />
      </section>

      {/* Login Modal Component */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-sm">
      <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center mb-4 border border-white/5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
