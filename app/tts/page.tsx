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
} from "lucide-react";

// Voice options by language
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
    { value: "en-IN-Neural2-A", label: "Indian Female (Neural A)" },
    { value: "en-IN-Neural2-B", label: "Indian Male (Neural B)" },
    { value: "en-IN-Neural2-C", label: "Indian Male (Neural C)" },
    { value: "en-IN-Neural2-D", label: "Indian Female (Neural D)" },
  ],
  "hi-IN": [
    { value: "hi-IN-Neural2-A", label: "Hindi Female (Neural A)" },
    { value: "hi-IN-Neural2-B", label: "Hindi Male (Neural B)" },
    { value: "hi-IN-Neural2-C", label: "Hindi Male (Neural C)" },
    { value: "hi-IN-Neural2-D", label: "Hindi Female (Neural D)" },
  ],
  "es-ES": [
    { value: "es-ES-Neural2-A", label: "Spanish Female (Neural A)" },
    { value: "es-ES-Neural2-B", label: "Spanish Male (Neural B)" },
    { value: "es-ES-Neural2-C", label: "Spanish Female (Neural C)" },
    { value: "es-ES-Neural2-D", label: "Spanish Female (Neural D)" },
  ],
  "fr-FR": [
    { value: "fr-FR-Neural2-A", label: "French Female (Neural A)" },
    { value: "fr-FR-Neural2-B", label: "French Male (Neural B)" },
    { value: "fr-FR-Neural2-C", label: "French Female (Neural C)" },
    { value: "fr-FR-Neural2-D", label: "French Male (Neural D)" },
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

  // Update voice when language changes
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
        body: JSON.stringify({
          text,
          language,
          voice,
          speed,
          pitch,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate speech");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `speech-${Date.now()}.mp3`;
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg text-gray-600">Checking authentication...</div>
      </div>
    );
  }

  const currentVoices = voicesByLanguage[language as keyof typeof voicesByLanguage] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Text-to-Speech Studio
              </h1>
              <p className="text-sm text-gray-500">
                Powered by Google Cloud AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.email}
              </p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Text Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Text
                </h2>
                <span className="text-sm text-gray-500">
                  {charCount} characters
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition"
                placeholder="Type or paste your text here... 

Try something like:
'Hello! This is a demonstration of AI-powered text-to-speech technology. It can convert any text into natural-sounding speech in multiple languages and voices.'"
              />

              {/* Status Messages */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">
                    Speech generated successfully! Check your downloads.
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={downloadSpeech}
                disabled={loading || !text.trim()}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Speech...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Generate & Download MP3
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Voice Settings
                </h2>
              </div>

              <div className="space-y-6">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-IN">English (India)</option>
                    <option value="hi-IN">Hindi</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                  </select>
                </div>

                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice
                  </label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  >
                    {currentVoices.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Speed Control */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Speed
                    </label>
                    <span className="text-sm font-semibold text-indigo-600">
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Pitch Control */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Pitch
                    </label>
                    <span className="text-sm font-semibold text-indigo-600">
                      {pitch > 0 ? "+" : ""}
                      {pitch}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Lower</span>
                    <span>Normal</span>
                    <span>Higher</span>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setSpeed(1);
                    setPitch(0);
                  }}
                  className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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