import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show preloader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-spin-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 to-purple-500/20 rounded-full animate-spin-slow-reverse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center animate-fade-in">
        {/* Logo Animation */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto animate-bounce-gentle shadow-2xl">
            <BookOpen className="w-10 h-10 text-white animate-pulse" />
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto blur-xl opacity-50 animate-pulse"></div>
        </div>

        {/* Brand Text */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
          Save
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            It
          </span>
        </h1>

        <p className="text-slate-300 text-lg animate-slide-up-delay">
          Your personal link & note organizer
        </p>

        {/* Loading Animation */}
        <div className="mt-8 flex justify-center animate-slide-up-delay-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce-1"></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce-2"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
