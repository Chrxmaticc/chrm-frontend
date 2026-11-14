"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Shield, KeyRound, Loader2 } from "lucide-react";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // CLEAN URL - NO TRAILING SLASH
  const API_URL = "https://chrm-api.onrender.com";

  if (!isOpen) return null;

  const handleOAuthLogin = () => {
    // Simulated OAuth
    localStorage.setItem("chrm_user_id", "test_user");
    router.push("/dashboard");
  };

  const handleTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/token`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: token.trim(), // Trims any hidden spaces
          discord_id: "test_user" 
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API REJECTED:", res.status, errorText);
        throw new Error(`API Error ${res.status}. Check console.`);
      }

      // Success!
      localStorage.setItem("chrm_user_id", "test_user");
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
          onClick={handleOAuthLogin}
          className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6"
        >
          <Shield className="w-5 h-5" />
          Login with Discord
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-gray-500 font-medium">OR USE TOKEN</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

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
                Authenticating...
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
