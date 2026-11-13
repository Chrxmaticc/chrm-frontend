"use client";

import { useState, useEffect } from "react";
import { Terminal, Shield, ArrowRight, Gamepad2, Zap, MessageSquare, Music, Bot, LayoutGrid } from "lucide-react";
import LoginModal from "@/components/LoginModal";

// --- REUSABLE CARD WRAPPER (The "Reference Image" Style) ---
function PremiumCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`group relative rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-transparent p-[1px] transition-all duration-500 hover:from-white/30 hover:via-white/10 ${className}`}>
      <div className="absolute inset-0 bg-white/5 blur-xl group-hover:bg-white/10 transition-all duration-500 rounded-3xl" />
      <div className="relative h-full w-full rounded-[23px] bg-[#0a0a0a] overflow-hidden">
        {/* Subtle inner top highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-sans overflow-x-hidden relative">
      
      {/* BACKGROUND GRID PATTERN */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            chrm<span className="text-gray-500">.cc</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#plugins" className="hover:text-white transition-colors">Plugins</a>
          </div>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-white text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <main className="relative z-10 pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.04] blur-[150px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          v1.0 alpha is now live
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 max-w-5xl leading-[1.1]">
          Your whole internet, <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">live.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12">
          Everything in a single panel. No commands to memorise, no config files to hand-edit. The ultimate selfbot engine.
        </p>

        <button
          onClick={() => setIsLoginOpen(true)}
          className="group relative flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
        >
          Deploy Your Engine
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      {/* ================= FEATURES ================= */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-32">
        
        {/* FEATURE 1: RPC */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#222] to-[#111] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">rich presence, redefined.</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Show off what you're doing with custom rich presence cards. Watch videos, play games, or flex your custom status with pixel-perfect rendering.
            </p>
          </div>
          <div className="flex-1 w-full max-w-md">
            <PremiumCard className="p-4">
              <RPCPreview />
            </PremiumCard>
          </div>
        </div>

        {/* FEATURE 2: FAKEPLAY */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
          <div className="flex-1 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#222] to-[#111] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">game spoofing.</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Wanna play a game but not actually playing it? Now you're able to do that. Fake your status with official application IDs and icons without using any CPU.
            </p>
          </div>
          <div className="flex-1 w-full max-w-md">
            <PremiumCard className="p-6">
              <FakePlayPreview />
            </PremiumCard>
          </div>
        </div>

        {/* FEATURE 3: AUTOMATION */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#222] to-[#111] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">smart automation.</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Never miss a beat. Auto-respond to keywords, react instantly, go AFK with a custom message, and snipe deleted messages before they vanish.
            </p>
          </div>
          <div className="flex-1 w-full max-w-md">
            <PremiumCard className="p-6">
              <AutomationPreview />
            </PremiumCard>
          </div>
        </div>
      </section>

      {/* ================= OTHER PLUGINS ================= */}
      <section id="plugins" className="relative z-10 border-t border-white/5 bg-[#050505] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">and a whole lot more.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <PluginCard 
              icon={<Music className="w-6 h-6 text-white" />}
              title="Live Lyrics Sync"
              desc="Automatically sync your Discord custom status with the exact timestamp of your Spotify playback."
            />
            <PluginCard 
              icon={<Zap className="w-6 h-6 text-white" />}
              title="Instant Sniper"
              desc="Logs and recovers deleted or edited messages the millisecond they disappear."
            />
            <PluginCard 
              icon={<Shield className="w-6 h-6 text-white" />}
              title="AI Integration"
              desc="Generate images and draft replies directly from Discord using OpenAI."
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-white/5 py-12 text-sm text-gray-500 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <Terminal className="w-4 h-4" /> chrm.cc
          </div>
          <p>© 2026 chrm. all rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">terms</a>
            <a href="#" className="hover:text-white transition-colors">privacy</a>
            <a href="#" className="hover:text-white transition-colors">discord</a>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

// --- PLUGIN CARD (Matches the Reference Image exactly) ---
function PluginCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <PremiumCard className="p-8 h-full flex flex-col items-start">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#222] to-[#111] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center mb-8">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-lg">{desc}</p>
    </PremiumCard>
  );
}

// --- INTERACTIVE PREVIEWS ---

// 1. RPC Preview (Matches your screenshot vibe)
function RPCPreview() {
  const [step, setStep] = useState(0);
  const states = [
    { name: "nova", status: "Competitive", detail: "Ascent • 9-7", color: "bg-green-500" },
    { name: "lune", status: "Blinding Lights", detail: "The Weeknd", color: "bg-red-500" },
    { name: "kai-dev", status: "Building things", detail: "1.2k followers", color: "bg-gray-500" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % states.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const curr = states[step];

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 transition-all duration-500 shadow-inner">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center border border-white/10 text-2xl">
            {curr.name.charAt(0).toUpperCase()}
          </div>
          <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#111] ${curr.color}`} />
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold text-white">{curr.name}</div>
          <div className="text-sm text-gray-300 flex items-center gap-2 mt-1">
            <Gamepad2 className="w-4 h-4 text-gray-400" />
            {curr.status}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{curr.detail}</div>
        </div>
      </div>
    </div>
  );
}

// 2. FakePlay Preview
function FakePlayPreview() {
  const [gameIndex, setGameIndex] = useState(0);
  const games = ["Minecraft", "Roblox", "Valorant", "Grand Theft Auto V", "Fortnite"];
  
  useEffect(() => {
    const timer = setInterval(() => setGameIndex((i) => (i + 1) % games.length), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs font-mono text-gray-400 bg-black/50 p-3 rounded-xl border border-white/5 shadow-inner">
        <Terminal className="w-4 h-4" /> .fakeplay {games[gameIndex].toLowerCase()}
      </div>
      <div className="flex items-center gap-5 mt-2 bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="w-20 h-20 rounded-xl bg-black flex items-center justify-center border border-white/10">
          <Gamepad2 className="w-8 h-8 text-white/30" />
        </div>
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Playing a game</div>
          <div className="text-xl font-black text-white transition-all">
            {games[gameIndex]}
          </div>
          <div className="text-xs text-gray-500 mt-1">0h 12m elapsed</div>
        </div>
      </div>
    </div>
  );
}

// 3. Automation Preview (Sniper)
function AutomationPreview() {
  const [step, setStep] = useState(0); // 0: typing, 1: sent, 2: deleted, 3: sniped

  useEffect(() => {
    const runSequence = async () => {
      setStep(0); // typing
      await new Promise(r => setTimeout(r, 1500));
      setStep(1); // sent
      await new Promise(r => setTimeout(r, 2000));
      setStep(2); // deleted
      await new Promise(r => setTimeout(r, 1000));
      setStep(3); // sniped
      await new Promise(r => setTimeout(r, 3000));
    };
    runSequence();
  }, [step]);

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 h-[240px] flex flex-col justify-end shadow-inner">
      {step === 0 && (
        <div className="text-sm text-gray-500 animate-pulse">typing...</div>
      )}
      {(step === 1 || step === 2 || step === 3) && (
        <div className={`transition-all duration-300 ${step === 2 ? 'opacity-30 blur-sm line-through' : 'opacity-100'}`}>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">U</div>
            <div>
              <div className="text-sm font-semibold text-white">user <span className="text-[10px] text-gray-500 ml-1">Today at 12:00 PM</span></div>
              <div className="text-sm text-gray-300 mt-1">did you see my secret message?</div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 border-t border-white/10 pt-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">C</div>
             <div className="flex-1">
              <div className="text-sm font-semibold text-white">chrm <span className="text-[10px] bg-white/10 px-1 py-0.5 rounded ml-1 uppercase text-gray-400 border border-white/10">App</span></div>
              <div className="text-sm text-gray-300 mt-2 bg-black/60 p-3 rounded-lg border border-white/5 shadow-inner">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block">Deleted Message Sniped</span>
                "did you see my secret message?"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
