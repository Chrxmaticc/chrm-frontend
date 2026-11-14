"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Power, Save, ArrowLeft, Settings, LogOut, Loader2, Bot, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";

interface UserSettings {
  prefix: string;
  delays_enabled: boolean;
  afk: {
    enabled: boolean;
    message: string;
  };
  autorespond: Record<string, string>;
  autoreact: Record<string, string>;
}

export default function Dashboard() {
  const router = useRouter();
  const [discordId, setDiscordId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    prefix: ".",
    delays_enabled: true,
    afk: { enabled: false, message: "afk" },
    autorespond: {},
    autoreact: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "https://chrm-api.onrender.com";

  useEffect(() => {
    const savedId = localStorage.getItem("chrm_user_id");
    if (!savedId) {
      router.push("/");
      return;
    }
    setDiscordId(savedId);

    fetch(`${API_URL}/api/user/${savedId}`)
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch user data");
        return res.json();
      })
      .then(data => {
        setIsActive(data.is_active);
        if (data.settings && Object.keys(data.settings).length > 0) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [API_URL, router]);

  const toggleBot = async () => {
    if (!discordId) return;
    const newState = !isActive;
    setIsActive(newState);

    try {
      await fetch(`${API_URL}/api/user/${discordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: {}, is_active: newState })
      });
    } catch (e) {
      setIsActive(!newState);
      alert("Failed to toggle engine.");
    }
  };

  const saveSettings = async () => {
    if (!discordId) return;
    setSaving(true);
    try {
      await fetch(`${API_URL}/api/user/${discordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settings, is_active: isActive })
      });
      alert("Settings saved! Engine will sync in 30 seconds.");
    } catch (e) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chrm_user_id");
    router.push("/");
  };

  if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mono">initializing engine...</div>;
  if (error) return <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4"><p className="text-red-400 font-mono">Error: {error}</p><button onClick={handleLogout} className="bg-white text-black px-4 py-2 rounded-lg">Go Back Home</button></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans selection:bg-white/20">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-serif flex items-center gap-2">
              <Terminal className="w-5 h-5" /> Engine Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Log out">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 ${isActive ? 'bg-gradient-to-r from-white/[0.08] to-transparent border-white/20' : 'bg-black border-white/10'}`}>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Power className={`w-6 h-6 ${isActive ? 'text-green-400' : 'text-gray-500'}`} />
              Engine Status
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-md">
              {isActive ? "Your selfbot is currently running 24/7 on our servers." : "Your selfbot is paused. It will not respond to commands or update your status."}
            </p>
          </div>
          <button onClick={toggleBot} className={`w-20 h-10 rounded-full transition-all duration-300 relative flex items-center px-1 shadow-inner ${isActive ? 'bg-green-500' : 'bg-gray-800 border border-white/10'}`}>
            <div className={`w-8 h-8 rounded-full bg-white shadow-md transition-transform duration-300 ${isActive ? 'translate-x-10' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 space-y-8 hover:border-white/20 transition-colors">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/10 pb-4">
              <Settings className="w-5 h-5 text-gray-400"/> Core Settings
            </h3>
            <div className="space-y-3">
              <label className="text-sm font-mono text-gray-400 uppercase tracking-wider">Command Prefix</label>
              <input type="text" value={settings.prefix} onChange={(e) => setSettings({...settings, prefix: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-lg font-mono focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all" maxLength={3} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-sm font-bold">Human Delays</label>
                <p className="text-xs text-gray-500 mt-1">Adds a realistic 1.5s - 4.5s delay.</p>
              </div>
              <input type="checkbox" checked={settings.delays_enabled} onChange={(e) => setSettings({...settings, delays_enabled: e.target.checked})} className="w-5 h-5 accent-white" />
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 space-y-8 hover:border-white/20 transition-colors">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/10 pb-4">
              <Bot className="w-5 h-5 text-gray-400"/> AFK Mode
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold">Enable AFK</label>
                <p className="text-xs text-gray-500 mt-1">Replies when pinged.</p>
              </div>
              <input type="checkbox" checked={settings.afk?.enabled || false} onChange={(e) => setSettings({...settings, afk: {...settings.afk, enabled: e.target.checked}})} className="w-5 h-5 accent-white" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-mono text-gray-400 uppercase tracking-wider">AFK Message</label>
              <input type="text" value={settings.afk?.message || ""} onChange={(e) => setSettings({...settings, afk: {...settings.afk, message: e.target.value}})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
