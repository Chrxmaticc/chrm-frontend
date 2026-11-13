"use client";

import { useState } from "react";
import { X, Shield, KeyRound } from "lucide-react";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [token, setToken] = useState("");

  if (!isOpen) return null;

  const handleOAuthLogin = () => {
    // Redirect to your FastAPI backend which handles the OAuth2 flow
    window.location.href = "https://your-render-api.com/api/auth/discord";
  };

  const handleTokenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    // In production, send this via fetch to your FastAPI /api/auth/token endpoint
    console.log("Sending token to backend for encryption...", token);
    
    // Example fetch:
    /*
    fetch("https://your-render-api.com/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    }).then(() => {
      // Redirect to dashboard
      window.location.href = "/dashboard";
    });
    */
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Welcome to chrm</h2>
        <p className="text-sm text-gray-400 mb-8">
          Connect your Discord account to deploy your selfbot engine.
        </p>

        {/* Option 1: OAuth */}
        <button 
          onClick={handleOAuthLogin}
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6"
        >
          <Shield className="w-5 h-5" />
          Login with Discord
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-gray-500 font-medium">OR USE TOKEN</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Option 2: Token Input */}
        <form onSubmit={handleTokenLogin} className="space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="Paste your Discord token..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                required
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-2 px-1">
              Tokens are encrypted with AES-256 before hitting our database. We never see your password.
            </p>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3 rounded-xl transition-colors"
          >
            Login with Token
          </button>
        </form>
      </div>
    </div>
  );
}
