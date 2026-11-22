"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Power, Save, ArrowLeft, Settings, LogOut, Loader2, Bot } from "lucide-react";
import Link from "next/link";

// Only these keys are actually read by the engine:
//   core/config.py -> data["settings"]["prefixes" | "delays_enabled" | "delay_min" | "delay_max"]
// The API blob (users.settings) becomes exactly that namespace, so anything else
// (features.afk, autorespond, emojis) lives in the bot's own config.json and
// cannot be driven from here. Controls for them were removed on purpose.
interface UserSettings {
  prefixes: string[];
  delays_enabled: boolean;
  delay_min: number;
  delay_max: number;
  afk: { enabled: boolean; message: string };
}

interface ApiPayload {
  settings?: {
    prefixes?: string[];
    prefix?: string | string[];
    delays_enabled?: boolean;
    delay_min?: number;
    delay_max?: number;
    afk?: { enabled?: boolean; message?: string };
    features?: { afk?: { enabled?: boolean; message?: string } };
  };
  is_active?: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [discordId, setDiscordId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    prefixes: ["."],
    delays_enabled: true,
    delay_min: 1.5,
    delay_max: 4.5,
    afk: { enabled: false, message: "afk" }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://chrm-api.onrender.com";

  // The API issues this at login and requires it on every per-user call, so a
  // random visitor cannot read or toggle somebody else's engine.
  const authHeaders = (json = false): Record<string, string> => {
    const headers: Record<string, string> = {};
    const key = localStorage.getItem("chrm_dashboard_key");
    if (key) headers["X-Dashboard-Key"] = key;
    if (json) headers["Content-Type"] = "application/json";
    return headers;
  };

  const clearSession = () => {
    localStorage.removeItem("chrm_user_id");
    localStorage.removeItem("chrm_dashboard_key");
  };

  useEffect(() => {
    const savedId = localStorage.getItem("chrm_user_id");
    if (!savedId) {
      router.push("/");
      return;
    }
    setDiscordId(savedId);

    fetch(`${API_URL}/api/user/${savedId}`, { headers: authHeaders() })
      .then(res => {
        if (res.status === 401 || res.status === 403) throw Object.assign(new Error("Session expired."), { auth: true });
        if (res.status === 404) throw Object.assign(new Error("Account not found."), { gone: true });
        if (!res.ok) throw new Error("Could not fetch user data");
        return res.json();
      })
      .then((data: ApiPayload) => {
        setIsActive(Boolean(data.is_active));
        const incoming = data.settings ?? {};
        // Older rows stored a single `prefix` string; new ones store `prefixes`.
        const raw = incoming.prefixes ?? incoming.prefix;
        const prefixes = Array.isArray(raw)
          ? raw.filter(Boolean)
          : typeof raw === "string" && raw.trim()
            ? [raw.trim()]
            : null;
        // AFK may sit at the blob root (legacy) or under features (current).
        const afk = incoming.features?.afk ?? incoming.afk;
        setSettings(prev => ({
          ...prev,
          ...(prefixes && prefixes.length ? { prefixes } : {}),
          delays_enabled: incoming.delays_enabled ?? prev.delays_enabled,
          delay_min: typeof incoming.delay_min === "number" ? incoming.delay_min : prev.delay_min,
          delay_max: typeof incoming.delay_max === "number" ? incoming.delay_max : prev.delay_max,
          afk: {
            enabled: afk?.enabled ?? prev.afk.enabled,
            message: afk?.message ?? prev.afk.message
          }
        }));
        setLoading(false);
      })
      .catch((err: any) => {
        if (err?.auth) {
          clearSession();
          setError("Session expired - log in with your token again.");
        } else if (err?.gone) {
          clearSession();
          router.push("/");
          return;
        } else {
          setError(err?.message || "Could not load the dashboard.");
        }
        setLoading(false);
      });
  }, [API_URL, router]);

  const toggleBot = async () => {
    if (!discordId) return;
    const newState = !isActive;
    setIsActive(newState);

    try {
      const res = await fetch(`${API_URL}/api/user/${discordId}`, {
        method: "PATCH",
        headers: authHeaders(true),
        body: JSON.stringify({ settings: {}, is_active: newState })
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
    } catch (e) {
      setIsActive(!newState);
      alert("Failed to toggle engine.");
    }
  };

  const saveSettings = async () => {
    if (!discordId) return;

    const prefixes = settings.prefixes.map(p => p.trim()).filter(Boolean);
    if (prefixes.length === 0) {
      alert("Pick at least one prefix.");
      return;
    }
    if (settings.delay_max <= settings.delay_min) {
      alert("Max delay must be larger than min delay.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/user/${discordId}`, {
        method: "PATCH",
        headers: authHeaders(true),
        body: JSON.stringify({
          // Keys the engine reads (core/config.py, apply_blob): namespace keys
          // merge in place, feature keys land under features, the rest under
          // settings.
          settings: {
            prefixes,
            delays_enabled: settings.delays_enabled,
            delay_min: settings.delay_min,
            delay_max: settings.delay_max,
            features: { afk: settings.afk }
          },
          is_active: isActive
        })
      });

      if (res.status === 401 || res.status === 403) {
        clearSession();
        router.push("/");
        throw new Error("Session expired - log in with your token again.");
      }
      if (res.status === 404) {
        throw new Error("This account is not registered with the engine. Log in with your token first.");
      }
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`API ${res.status}. ${detail.slice(0, 120)}`);
      }

      alert("Settings saved! Engine will sync in 30 seconds.");
    } catch (e: any) {
      alert(e?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (!discordId) {
      router.push("/");
      return;
    }
    if (!confirm("Log out? This deletes your stored token, so the engine stops completely (your settings are deleted too).")) {
      return;
    }
    try {
      await fetch(`${API_URL}/api/auth/logout/${discordId}`, { method: "DELETE", headers: authHeaders() });
    } catch (e) {
      // Still clear the browser side; the row is orphaned but harmless.
    }
    clearSession();
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
              <input
                type="text"
                value={settings.prefixes[0] ?? ""}
                onChange={(e) => setSettings({ ...settings, prefixes: [e.target.value, ...settings.prefixes.slice(1)] })}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-lg font-mono focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                maxLength={3}
              />
              <p className="text-xs text-gray-500">
                Stored as <span className="font-mono text-gray-400">prefixes[]</span> — the engine always also accepts <span className="font-mono text-gray-400">.</span> so you can never lock yourself out.
                {settings.prefixes.length > 1 && (
                  <> Also active: <span className="font-mono text-gray-400">{settings.prefixes.slice(1).join(" ")}</span>.</>
                )}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-sm font-bold">Human Delays</label>
                <p className="text-xs text-gray-500 mt-1">Random wait between each command.</p>
              </div>
              <input type="checkbox" checked={settings.delays_enabled} onChange={(e) => setSettings({...settings, delays_enabled: e.target.checked})} className="w-5 h-5 accent-white" />
            </div>
            <div className={`grid grid-cols-2 gap-4 transition-opacity ${settings.delays_enabled ? "" : "opacity-40"}`}>
              <div className="space-y-3">
                <label className="text-sm font-mono text-gray-400 uppercase tracking-wider">Min (s)</label>
                <input
                  type="number" step="0.1" min="0" max="30"
                  disabled={!settings.delays_enabled}
                  value={settings.delay_min}
                  onChange={(e) => setSettings({ ...settings, delay_min: Number(e.target.value) })}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-lg font-mono focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-mono text-gray-400 uppercase tracking-wider">Max (s)</label>
                <input
                  type="number" step="0.1" min="0" max="30"
                  disabled={!settings.delays_enabled}
                  value={settings.delay_max}
                  onChange={(e) => setSettings({ ...settings, delay_max: Number(e.target.value) })}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-lg font-mono focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 space-y-8 hover:border-white/20 transition-colors">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/10 pb-4">
              <Bot className="w-5 h-5 text-gray-400"/> AFK Mode
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold">Enable AFK</label>
                <p className="text-xs text-gray-500 mt-1">Replies when you get pinged.</p>
              </div>
              <input type="checkbox" checked={settings.afk.enabled} onChange={(e) => setSettings({ ...settings, afk: { ...settings.afk, enabled: e.target.checked } })} className="w-5 h-5 accent-white" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-mono text-gray-400 uppercase tracking-wider">AFK Message</label>
              <input
                type="text"
                disabled={!settings.afk.enabled}
                value={settings.afk.message}
                onChange={(e) => setSettings({ ...settings, afk: { ...settings.afk, message: e.target.value } })}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
              />
              <p className="text-xs text-gray-500">
                Stored under <span className="font-mono text-gray-400">features.afk</span>, which is where the engine reads it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
