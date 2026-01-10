"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { 
  Volume2, 
  Zap, 
  Shield, 
  Globe, 
  Mic, 
  Download, 
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  // Only redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/tts");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VoiceAI</span>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white font-medium">
              Powered by Google Cloud AI
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Text Into
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Natural Speech
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Create professional voiceovers with AI-powered text-to-speech. 
            30+ voices, multiple languages, instant results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => router.push("/login")}
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">30+</div>
              <div className="text-gray-400">AI Voices</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">5</div>
              <div className="text-gray-400">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">Free to Try</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Everything You Need
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Neural Voices
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Access 30+ premium AI voices powered by Google's neural technology. 
                Sound natural and professional every time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Generate high-quality speech in seconds. No waiting, 
                no rendering queues. Instant results every time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Multi-Language
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Create content in English, Hindi, Spanish, French and more. 
                Native accents for authentic sound.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Instant Download
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Download your audio as high-quality MP3 files. 
                Ready to use in videos, podcasts, or presentations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Full Control
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Adjust speed, pitch, and voice characteristics. 
                Fine-tune every detail to match your vision.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Secure & Private
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your data is protected with enterprise-grade security. 
                We never store or share your content.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Perfect For
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">
            Whatever your project, we've got you covered
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold text-lg mb-2">YouTube Videos</h4>
                <p className="text-gray-400">Create engaging voiceovers for your video content</p>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold text-lg mb-2">Podcasts</h4>
                <p className="text-gray-400">Generate intros, outros, and narration</p>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold text-lg mb-2">E-Learning</h4>
                <p className="text-gray-400">Add professional narration to courses and tutorials</p>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold text-lg mb-2">Audiobooks</h4>
                <p className="text-gray-400">Transform written content into spoken audio</p>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold text-lg mb-2">Presentations</h4>
                <p className="text-gray-400">Make your slides come alive with voice</p>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold text-lg mb-2">Marketing</h4>
                <p className="text-gray-400">Create voice ads and promotional content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators using AI to bring their content to life
            </p>
            <button
              onClick={() => router.push("/login")}
              className="group px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 inline-flex items-center gap-3"
            >
              Start Creating Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-400 mt-6">
              Demo credentials: test@test.com / 123456
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">VoiceAI</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2026 VoiceAI. Powered by Google Cloud Text-to-Speech.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}