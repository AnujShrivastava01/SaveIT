import { Github, Linkedin, Heart, Code, Coffee } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 border-t border-purple-500/20 backdrop-blur-lg relative overflow-hidden z-30 shadow-2xl shadow-purple-500/10">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/8 to-blue-500/10 animate-pulse"></div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-900/5 to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-3 md:py-4">
        <div className="text-center space-y-2 md:space-y-3">
          {/* Made with Love Section */}
          <div className="flex items-center justify-center space-x-1 md:space-x-2 text-sm md:text-base">
            <span className="text-slate-300">Made with</span>
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 animate-pulse fill-current" />
            <span className="text-slate-300">and</span>
            <Coffee className="w-3 h-3 md:w-4 md:h-4 text-amber-500 animate-bounce" />
            <span className="text-slate-300">by</span>
            <span className="font-bold text-white">Anuj</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center space-x-4 md:space-x-6">
            <a
              href="https://github.com/AnujShrivastava01"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-1 text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-105">
              <Github className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium hidden sm:block">
                GitHub
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/anujshrivastava1/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-1 text-slate-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-105">
              <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium hidden sm:block">
                LinkedIn
              </span>
            </a>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-700/30 pt-1 md:pt-2">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} SaveIt. Crafted with passion for
              productivity.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
