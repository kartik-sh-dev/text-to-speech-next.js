"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  Download,
  LogOut,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";

const voicesByLanguage = {
  "en-US": [
    { value: "en-US-Neural2-A", label: "US Female (Neural A)" },
    { value: "en-US-Neural2-C", label: "US Female (Neural C)" },
    { value: "en-US-Neural2-D", label: "US Male (Neural D)" },
    { value: "en-US-Neural2-F", label: "US Female (Neural F)" },
    { value: "en-US-Neural2-G", label: "US Female (Neural G)" },
    { value: "en-US-Neural2-H", label: "US Female (Neural H)" },
    { value: "en-US-Neural2-I", label: "US Male (Neural I)" },
    { value: "en-US-Neural2-J", label: "US Male (Neural J)" },
  ],
  "en-IN": [
    { value: "en-IN-Neural2-A", label: "Indian Female" },
    { value: "en-IN-Neural2-B", label: "Indian Male" },
    { value: "en-IN-Neural2-C", label: "Indian Male 2" },
    { value: "en-IN-Neural2-D", label: "Indian Female 2" },
  ],
  "hi-IN": [
    { value: "hi-IN-Neural2-A", label: "Hindi Female" },
    { value: "hi-IN-Neural2-B", label: "Hindi Male" },
    { value: "hi-IN-Neural2-C", label: "Hindi Male 2" },
    { value: "hi-IN-Neural2-D", label: "Hindi Female 2" },
  ],
  "es-ES": [
    { value: "es-ES-Neural2-A", label: "Spanish Female" },
    { value: "es-ES-Neural2-B", label: "Spanish Male" },
  ],
  "fr-FR": [
    { value: "fr-FR-Neural2-A", label: "French Female" },
    { value: "fr-FR-Neural2-B", label: "French Male" },
  ],
};

export default function TTSPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [voice, setVoice] = useState("en-US-Neural2-D");
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  useEffect(() => {
    const voices = voicesByLanguage[language as keyof typeof voicesByLanguage];
    if (voices && voices.length > 0) {
      setVoice(voices[0].value);
    }
  }, [language]);

  const downloadSpeech = async () => {
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language, voice, speed, pitch }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate speech");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `voiceai-${Date.now()}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to generate speech");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  const currentVoices = voicesByLanguage[language as keyof typeof voicesByLanguage] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-opacity-5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Voice Studio</h1>
              <p className="text-sm text-gray-400">AI Text-to-Speech</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10">
              <User className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-medium">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-300 rounded-lg transition-all border border-red-500 border-opacity-30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Text Input */}
          <div className="lg:col-span-2">
            <div className="bg-opacity-5 rounded-3xl shadow-2xl p-8 border border-white border-opacity-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Your Text</h2>
                <span className="text-sm text-gray-800 bg-white bg-opacity-10 px-3 py-1 rounded-lg">
                  {charCount} / 5000
                </span>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={5000}
                className="w-full h-80 p-6 bg-white bg-opacity-5 border border-white border-opacity-20 rounded-2xl placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-lg"
                placeholder="Type or paste your text here...

Example: Welcome to VoiceAI! Transform your text into natural-sounding speech with advanced AI technology."
              />

              {error && (
                <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-4 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-50 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-200">Speech generated successfully! Check your downloads.</p>
                </div>
              )}

              <button
                onClick={downloadSpeech}
                disabled={loading || !text.trim()}
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-5 rounded-xl transition-all shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating Speech...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    Generate & Download MP3
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-opacity-5 rounded-3xl shadow-2xl p-8 border border-white border-opacity-10 sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <Settings className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="en-US" className="bg-slate-800">English (US)</option>
                    <option value="en-IN" className="bg-slate-800">English (India)</option>
                    <option value="hi-IN" className="bg-slate-800">Hindi</option>
                    <option value="es-ES" className="bg-slate-800">Spanish</option>
                    <option value="fr-FR" className="bg-slate-800">French</option>
                  </select>
                </div>

                {/* Voice */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Voice</label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {currentVoices.map((v) => (
                      <option key={v.value} value={v.value} className="bg-slate-800">
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Speed */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-white">Speed</label>
                    <span className="text-sm font-bold text-purple-1000 bg-purple-500 bg-opacity-20 px-3 py-1 rounded-lg">
                      {speed.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-white bg-opacity-20 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Pitch */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-white">Pitch</label>
                    <span className="text-sm font-bold text-pink-1000 bg-pink-500 bg-opacity-20 px-3 py-1 rounded-lg">
                      {pitch > 0 ? "+" : ""}{pitch}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="w-full h-2 bg-white bg-opacity-20 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Lower</span>
                    <span>Normal</span>
                    <span>Higher</span>
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={() => {
                    setSpeed(1);
                    setPitch(0);
                  }}
                  className="w-full py-3 bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 rounded-xl text-sm font-semibold transition-all"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}