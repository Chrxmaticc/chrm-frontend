"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, Shield, ArrowRight, Gamepad2, Zap, Bot, ChevronDown, Activity } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Live Activity Ticker
  const [commandsRun, setCommandsRun] = useState(56);
  useEffect(() => {
    const interval = setInterval(() => {
      setCommandsRun(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // 3D Tilt Effect for Hero Image
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 overflow-x-hidden font-sans relative">
      
      {/* GLOBAL NOISE & GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]" 
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
      />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-[#050505]/60 backdrop-blur-2xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif tracking-tight flex items-center gap-2">
            <Terminal className="w-6 h-6" />
            chrm<span className="text-gray-600">.cc</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-mono text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">01. Features</a>
            <a href="#faq" className="hover:text-white transition-colors">02. FAQ</a>
          </div>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
          >
            Login
          </button>
        </div>
      </nav>

      {/* MASSIVE HERO */}
      <main 
        className="relative z-10 pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center perspective-[1000px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/[0.05] blur-[150px] rounded-full pointer-events-none" />

        {/* Floating Rotated UI (wsp.baby style) */}
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-40 pointer-events-none"
        >
          <div className="w-[600px] h-[400px] bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl -rotate-6 flex flex-col gap-4">
             <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-white/20"/><div className="w-3 h-3 rounded-full bg-white/20"/><div className="w-3 h-3 rounded-full bg-white/20"/></div>
             <div className="w-1/2 h-4 bg-white/10 rounded-md mt-4" />
             <div className="w-3/4 h-4 bg-white/5 rounded-md" />
             <div className="w-full h-32 bg-white/[0.02] rounded-xl mt-4 border border-white/5" />
          </div>
        </motion.div>

        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            systems operational
          </div>

          <h1 className="text-7xl md:text-[9rem] font-serif tracking-tighter leading-[0.9] max-w-6xl mx-auto">
            the ultimate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">selfbot engine.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            take absolute control of your discord presence. spoof games, sync lyrics, automate replies, and snipe messages with a single click. no config files. no limits.
          </p>

          <div className="flex items-center justify-center gap-6 pt-8">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105"
            >
              Deploy Engine
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#features" className="font-mono text-sm text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
              view features ↓
            </a>
          </div>
        </div>
      </main>

      {/* LIVE ACTIVITY TICKER */}
      <div className="relative z-10 border-y border-white/10 bg-[#0a0a0a] overflow-hidden flex items-center h-16">
        <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
        <div className="flex whitespace-nowrap animate-marquee font-mono text-sm text-gray-400 uppercase tracking-widest">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> {commandsRun} commands have been run.</span>
              <span className="text-white/20">•</span>
              <span>uptime 99.99%</span>
              <span className="text-white/20">•</span>
              <span>latency 24ms</span>
              <span className="text-white/20">•</span>
              <span>active nodes: 14</span>
              <span className="text-white/20">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32 space-y-40">
        
        {/* FEATURE 1: RPC */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#222] to-[#0a0a0a] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-serif tracking-tight">rich presence.</h2>
            <p className="text-xl text-gray-400 leading-relaxed font-light">
              bypass standard limitations and project custom rich presence cards directly to your profile. watch videos, flex custom statuses, or display standard games with pixel-perfect rendering. our engine routes presence packets seamlessly, ensuring zero lag and full compliance with visual rendering.
            </p>
            <ul className="space-y-3 font-mono text-sm text-gray-500">
              <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-white"/> custom status rotation</li>
              <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-white"/> spotify + game integration</li>
              <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-white"/> image asset proxying</li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-white/30 transition-colors duration-500">
              <RPCPreview />
            </div>
          </div>
        </div>

        {/* FEATURE 2: FAKEPLAY */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
             <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-white/30 transition-colors duration-500">
              <FakePlayPreview />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#222] to-[#0a0a0a] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-serif tracking-tight">game spoofing.</h2>
            <p className="text-xl text-gray-400 leading-relaxed font-light">
              wanna play a game but not actually playing it? now you're able to do that. our engine interfaces directly with discord's application mapping, allowing you to spoof any executable status without using a single drop of cpu or ram. look like you're grinding 24/7 while you sleep.
            </p>
             <ul className="space-y-3 font-mono text-sm text-gray-500">
              <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-white"/> 5,000+ game database</li>
              <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-white"/> official icon rendering</li>
              <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-white"/> 0% cpu usage</li>
            </ul>
          </div>
        </div>

        {/* FEATURE 3: AUTOMATION */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#222] to-[#0a0a0a] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-serif tracking-tight">smart automation.</h2>
            <p className="text-xl text-gray-400 leading-relaxed font-light">
              never miss a beat. our automation suite runs on a hyper-optimized event bus, allowing you to auto-respond to specific keywords, react instantly to triggers, and snipe deleted messages before they vanish. set human-like delays to make your bot indistinguishable from a real user.
            </p>
             <ul className="space-y-3 font-mono text-sm text-gray-500">
              <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-white"/> instant message sniping</li>
              <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-white"/> regex auto-responders</li>
              <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-white"/> human delay algorithms</li>
            </ul>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-white/30 transition-colors duration-500">
              <AutomationPreview />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 border-t border-white/10 bg-[#070707] py-32">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-serif tracking-tight mb-16 text-center">frequently asked questions.</h2>
          <div className="space-y-4">
            <FAQItem question="Is this safe for my account?" answer="While chrm operates entirely client-side and avoids malicious API scraping, selfbots inherently violate Discord's Terms of Service. We strongly recommend using a secondary account that you are willing to lose." />
            <FAQItem question="How does the game spoofing work?" answer="We don't run the actual game files. Instead, we interface with Discord's activity gateway, sending spoofed application IDs that map to official games, triggering Discord to render the game card." />
            <FAQItem question="Do I need to keep my computer on?" answer="No. Once you deploy your token to our engine, it runs 24/7 on our cloud infrastructure. You can close your browser and the bot will stay online." />
            <FAQItem question="How are tokens encrypted?" answer="All user tokens are encrypted at rest using AES-256-GCM before hitting the database. We never log plaintext tokens, and the decryption keys are held in isolated environment variables." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-12 bg-[#050505] text-sm font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-serif text-xl">
            <Terminal className="w-5 h-5" /> chrm.cc
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

// --- INTERACTIVE FAQ ITEM ---
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className="border border-white/10 rounded-2xl bg-[#0a0a0a] cursor-pointer hover:border-white/30 transition-colors overflow-hidden"
    >
      <div className="p-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <div className={`px-6 pb-6 text-gray-400 leading-relaxed font-light transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
        {answer}
      </div>
    </div>
  );
}

// --- INTERACTIVE PREVIEWS ---

function RPCPreview() {
  const [step, setStep] = useState(0);
  const states = [
    { name: "nova", status: "Competitive", detail: "Ascent • 9-7", color: "bg-white" },
    { name: "lune", status: "Blinding Lights", detail: "The Weeknd", color: "bg-gray-400" },
    { name: "kai-dev", status: "Building things", detail: "1.2k followers", color: "bg-white" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % states.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const curr = states[step];

  return (
    <div className="flex items-center gap-5 bg-[#111] border border-white/10 rounded-2xl p-5 shadow-inner transition-all duration-500">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center border border-white/20 text-2xl font-serif">
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
        <div className="text-xs text-gray-500 mt-1 font-mono">{curr.detail}</div>
      </div>
    </div>
  );
}

function FakePlayPreview() {
  const [gameIndex, setGameIndex] = useState(0);
  const games = ["Minecraft", "Roblox", "Valorant", "Grand Theft Auto V", "Fortnite"];
  
  useEffect(() => {
    const timer = setInterval(() => setGameIndex((i) => (i + 1) % games.length), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs font-mono text-gray-400 bg-black/60 p-3 rounded-xl border border-white/10 shadow-inner">
        <Terminal className="w-4 h-4" /> .fakeplay {games[gameIndex].toLowerCase()}
      </div>
      <div className="flex items-center gap-5 mt-2 bg-[#111] p-5 rounded-2xl border border-white/10">
        <div className="w-20 h-20 rounded-xl bg-black flex items-center justify-center border border-white/10">
          <Gamepad2 className="w-8 h-8 text-white/30" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Playing a game</div>
          <div className="text-xl font-black text-white transition-all font-serif">
            {games[gameIndex]}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-mono">0h 12m elapsed</div>
        </div>
      </div>
    </div>
  );
}

function AutomationPreview() {
  const [step, setStep] = useState(0); 

  useEffect(() => {
    const runSequence = async () => {
      setStep(0);
      await new Promise(r => setTimeout(r, 1500));
      setStep(1);
      await new Promise(r => setTimeout(r, 2000));
      setStep(2);
      await new Promise(r => setTimeout(r, 1000));
      setStep(3);
      await new Promise(r => setTimeout(r, 3000));
    };
    runSequence();
  }, [step]);

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-[240px] flex flex-col justify-end shadow-inner font-sans">
      {step === 0 && (
        <div className="text-sm text-gray-500 animate-pulse font-mono">typing...</div>
      )}
      {(step === 1 || step === 2 || step === 3) && (
        <div className={`transition-all duration-300 ${step === 2 ? 'opacity-30 blur-sm line-through' : 'opacity-100'}`}>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-bold border border-white/20">U</div>
            <div>
              <div className="text-sm font-semibold text-white">user <span className="text-[10px] text-gray-500 ml-1 font-mono">Today at 12:00 PM</span></div>
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
              <div className="text-sm font-semibold text-white">chrm <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded ml-1 uppercase text-gray-400 border border-white/20 font-mono">App</span></div>
              <div className="text-sm text-gray-300 mt-2 bg-black/80 p-3 rounded-lg border border-white/10 shadow-inner font-mono">
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
