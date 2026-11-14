"use client";

import { useState, useEffect } from "react";
import { Terminal, Power, Save, ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [isActive, setIsActive] = useState(true);
  const [settings, setSettings] = useState({
    prefix: ".",
    delays_enabled: true,
    afk: { enabled: false, message: "afk" }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const DISCORD_ID = "test_user"; // In prod, get this from your auth token/localStorage

  // Fetch current settings on load
  useEffect(() => {
    fetch(`${API_URL}/api/user/${DISCORD_ID}`)
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
           // merge with defaults safely
           setSettings(prev => ({ ...prev, ...data.settings }));
        }
        if (data.is_active !== undefined) {
           setIsActive(data.is_active);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API_URL]);

  const saveSettings = async () => {
    setSaving(true);
    await fetch(`${API_URL}/api/user/${DISCORD_ID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings, is_active: isActive })
    });
    setSaving(false);
    alert("Settings saved. Bot will sync in 30 seconds.");
  };

  const toggleBot = async () => {
    const newState = !isActive;
    setIsActive(newState);
    await fetch(`${API_URL}/api/user/${DISCORD_ID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: {}, is_active: newState })
    });
  };

  if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mono">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-serif flex items-center gap-2">
              <Terminal className="w-5 h-5" /> Engine Dashboard
            </h1>
          </div>
          <button 
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Master Toggle */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors ${isActive ? 'bg-white/[0.05] border-white/20' : 'bg-black border-white/10'}`}>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Power className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-red-400'}`} />
              Selfbot Engine Status
            </h2>
            <p className="text-gray-400 text-sm mt-1">Toggle your bot on or off globally.</p>
          </div>
          <button 
            onClick={toggleBot}
            className={`w-16 h-8 rounded-full transition-colors relative flex items-center px-1 ${isActive ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${isActive ? 'translate-x-8' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* General Settings */}
          <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-6">
            <h3 className="font-semibold flex items-center gap-2"><Settings className="w-4 h-4"/> General</h3>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Command Prefix</label>
              <input 
                type="text" 
                value={settings.prefix}
                onChange={(e) => setSettings({...settings, prefix: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Human Delays</label>
                <p className="text-xs text-gray-500">Adds 1.5s - 4.5s delay to actions</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.delays_enabled}
                onChange={(e) => setSettings({...settings, delays_enabled: e.target.checked})}
                className="w-5 h-5 accent-white"
              />
            </div>
          </div>

          {/* AFK Settings */}
          <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-6">
            <h3 className="font-semibold">AFK Mode</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Enable AFK</label>
                <p className="text-xs text-gray-500">Replies when someone mentions you</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.afk?.enabled || false}
                onChange={(e) => setSettings({...settings, afk: {...settings.afk, enabled: e.target.checked}})}
                className="w-5 h-5 accent-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">AFK Message</label>
              <input 
                type="text" 
                value={settings.afk?.message || ""}
                onChange={(e) => setSettings({...settings, afk: {...settings.afk, message: e.target.value}})}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-white focus:outline-none"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
