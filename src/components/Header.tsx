import { BookOpen, Sparkles } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import FancyThemeToggle from './FancyThemeToggle';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const isClerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  // PWA install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstall(false);
      }
    }
  };

  return (
    <header
      className={`z-40 transition-all duration-300
        sticky top-0
        bg-white/60 dark:bg-slate-900/60
        backdrop-blur-md
        border-b border-slate-700/30
        shadow-lg
        md:relative md:bg-transparent md:backdrop-blur-none md:shadow-none
      `}
      style={{ minHeight: 64 }}
    >
      <div className="container mx-auto px-4 py-3 md:py-4 relative">
        {/* Toggle button absolute top right */}
        <div className="absolute right-4 top-4 z-50">
          <FancyThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BookOpen className="w-5 h-5 md:w-7 md:h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 text-yellow-400 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="group-hover:translate-x-1 transition-transform duration-300">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white animate-slide-in-left">
                Save
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  It
                </span>
              </h1>
              <p className="text-gray-700 dark:text-slate-400 text-xs md:text-sm animate-slide-in-left-delay hidden sm:block">
                Your personal link & note organizer
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 animate-slide-in-right">
            {showInstall && (
              <button
                onClick={handleInstallClick}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:from-purple-600 hover:to-pink-600 transition-all duration-300 mr-2"
                style={{ outline: "none" }}>
                Install App
              </button>
            )}
            {isClerkConfigured ? (
              <>
                <SignedOut>
                  <SignInButton>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-sm md:text-base px-3 md:px-4 py-2">
                      <span className="relative z-10">Sign In</span>
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <UserButton />
                  </div>
                </SignedIn>
              </>
            ) : (
              <Button
                disabled
                className="bg-gray-500 cursor-not-allowed text-sm md:text-base px-3 md:px-4 py-2">
                Auth Disabled
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
