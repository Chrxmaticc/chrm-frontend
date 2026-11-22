"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Shield, KeyRound, Loader2 } from "lucide-react";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Authenticating...");
  const [error, setError] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://chrm-api.onrender.com";

  if (!isOpen) return null;

  const handleTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setError("");
    setLoadingText("Validating token with Discord...");

    const cleanToken = token.trim();

    try {
      // 1. Validate token with Discord and get the real User ID
      const discordRes = await fetch("https://discord.com/api/v9/users/@me", {
        headers: {
          Authorization: cleanToken,
        },
      });

      if (!discordRes.ok) {
        throw new Error("Invalid token. Please check it and try again.");
      }

      const discordData = await discordRes.json();
      const realDiscordId = discordData.id; // The actual user ID

      setLoadingText("Saving to engine...");

      // 2. Send the token and the REAL ID to your API
      const res = await fetch(`${API_URL}/api/auth/token`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: cleanToken, 
          discord_id: realDiscordId 
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API REJECTED:", res.status, errorText);
        throw new Error(`API Error ${res.status}. Check console.`);
      }

      const saved: { dashboard_key?: string } = await res.json().catch(() => ({}));
      if (!saved.dashboard_key) {
        throw new Error("API did not return a dashboard key - redeploy chrm-api first.");
      }

      // 3. Save the REAL ID + the per-user key the API requires on later calls
      localStorage.setItem("chrm_user_id", realDiscordId);
      localStorage.setItem("chrm_dashboard_key", saved.dashboard_key);
      router.push("/dashboard");
      onClose();
      
    } catch (err: any) {
      setError(err.message || "Failed to connect to API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Welcome to chrm</h2>
        <p className="text-sm text-gray-400 mb-8">
          Connect your Discord account to deploy your selfbot engine.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button 
          disabled
          title="Discord OAuth is not connected to the API yet - use your token below"
          className="w-full bg-white/40 text-black/60 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-2 cursor-not-allowed"
        >
          <Shield className="w-5 h-5" />
          Login with Discord
        </button>
        <p className="text-[11px] text-gray-500 text-center mb-6 font-mono">
          OAuth coming soon - use your token
        </p>

        <form onSubmit={handleTokenLogin} className="space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="Paste your Discord token..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-gray-600"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a1a1a] border border-white/10 hover:bg-[#222] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {loadingText}
              </>
            ) : (
              "Login with Token"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
