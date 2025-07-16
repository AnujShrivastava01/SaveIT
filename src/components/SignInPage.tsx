import { SignIn } from "@clerk/clerk-react";
import {
  BookOpen,
  Star,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  Globe,
  Search,
  Bookmark,
} from "lucide-react";
import Navbar from './Navbar';
import { useTheme } from '../contexts/ThemeContext';

const SignInPage = () => {
  const { theme } = useTheme();
  return (
    <div
      className={
        `relative overflow-x-hidden flex flex-col min-h-screen ` +
        (theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
          : 'bg-white')
      }
      style={{ minHeight: '100vh' }}
    >
      <Navbar transparent={true} />
      {/* Main content below navbar, always visible and fills viewport */}
      <main className={
        `pt-20 min-h-[calc(100vh-80px)] ` +
        (theme === 'light' ? 'text-charcoal' : 'text-white')
      }>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-spin-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-spin-slow-reverse" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-bounce-gentle" />
      </div>

      {/* Floating 3D-like elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-6 h-6 bg-purple-500/30 rounded-full blur-sm animate-bounce-1" />
        <div className="absolute top-32 right-20 w-4 h-4 bg-pink-500/40 rounded-full blur-sm animate-bounce-2" />
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-blue-500/35 rounded-full blur-sm animate-bounce-3" />
        <div className="absolute top-40 left-1/2 w-3 h-3 bg-yellow-500/50 rounded-full blur-sm animate-pulse" />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-green-500/40 rounded-full blur-sm animate-bounce-gentle" />
      </div>

      <div className="relative z-10 container mx-auto px-2 sm:px-1 flex-1 flex items-start justify-center pt-4 pb-0">
        <div className="w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
          {/* Left side - Enhanced Features and branding */}
            <div className={`space-y-4 md:space-y-6 order-2 lg:order-1 px-4 sm:px-6 md:px-8 ${theme === 'light' ? 'text-charcoal' : 'text-white'}`}>
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-xl sm:text-lg md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight animate-slide-up">
                Organize your digital life with
                  <span className={theme === 'light' ? 'text-accentPurple font-bold' : 'text-purple-400 font-bold'}> ease</span>
              </h2>

                <p className={theme === 'light' ? 'text-sm sm:text-xs md:text-lg lg:text-xl text-charcoal/80 animate-slide-up delay-200 leading-relaxed' : 'text-sm sm:text-xs md:text-lg lg:text-xl text-slate-300 animate-slide-up delay-200 leading-relaxed'}>
                Save links, store notes, and organize your digital content in
                one beautiful, secure place.
              </p>

              {/* Call to action */}
                <div className={theme === 'light' ? 'flex items-center space-x-2 animate-slide-up delay-300' : 'flex items-center space-x-2 text-purple-300 animate-slide-up delay-300'}>
                  <ArrowRight className={theme === 'light' ? 'w-4 h-4 md:w-5 md:h-5 animate-bounce-gentle text-accentPurple' : 'w-4 h-4 md:w-5 md:h-5 animate-bounce-gentle'} />
                  <span className={theme === 'light' ? 'text-xs sm:text-xs md:text-base lg:text-lg font-medium text-accentPurple cursor-pointer hover:underline' : 'text-xs sm:text-xs md:text-base lg:text-lg font-medium'}>Start organizing today</span>
              </div>
            </div>{" "}
            {/* Enhanced Features list */}
            <div className="space-y-3 md:space-y-4">
              <div className={
                'flex items-start space-x-3 md:space-x-4 animate-slide-up delay-400 group'
              }>
                  <div className={
                    theme === 'light'
                      ? 'w-10 h-10 md:w-12 md:h-12 bg-transparent border-0 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300'
                      : 'w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500/20 to-purple-600/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20'
                  }>
                    <Star className={theme === 'light' ? 'w-5 h-5 md:w-6 md:h-6 text-accentPurple' : 'w-5 h-5 md:w-6 md:h-6 text-purple-400'} />
                </div>
                <div>
                    <h3 className={theme === 'light' ? 'font-semibold text-base md:text-lg text-charcoal' : 'font-semibold text-base md:text-lg'}>Smart Organization</h3>
                    <p className={theme === 'light' ? 'text-charcoal/80 text-sm md:text-base' : 'text-slate-400 text-sm md:text-base'}>
                    Automatically categorize and tag your saved content for easy
                    retrieval.
                  </p>
                </div>
              </div>

              <div className={
                'flex items-start space-x-3 md:space-x-4 animate-slide-up delay-500 group'
              }>
                  <div className={
                    theme === 'light'
                      ? 'w-10 h-10 md:w-12 md:h-12 bg-transparent border-0 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300'
                      : 'w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20'
                  }>
                    <Shield className={theme === 'light' ? 'w-5 h-5 md:w-6 md:h-6 text-blue-600' : 'w-5 h-5 md:w-6 md:h-6 text-blue-400'} />
                </div>
                <div>
                    <h3 className={theme === 'light' ? 'font-semibold text-base md:text-lg text-charcoal' : 'font-semibold text-base md:text-lg'}>Secure & Private</h3>
                    <p className={theme === 'light' ? 'text-charcoal/80 text-sm md:text-base' : 'text-slate-400 text-sm md:text-base'}>
                    Your data is encrypted and stored securely with
                    enterprise-grade protection.
                  </p>
                </div>
              </div>

              <div className={
                'flex items-start space-x-3 md:space-x-4 animate-slide-up delay-600 group'
              }>
                  <div className={
                    theme === 'light'
                      ? 'w-10 h-10 md:w-12 md:h-12 bg-transparent border-0 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300'
                      : 'w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500/20 to-green-600/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-green-500/20'
                  }>
                    <Zap className={theme === 'light' ? 'w-5 h-5 md:w-6 md:h-6 text-green-600' : 'w-5 h-5 md:w-6 md:h-6 text-green-400'} />
                </div>
                <div>
                    <h3 className={theme === 'light' ? 'font-semibold text-base md:text-lg text-charcoal' : 'font-semibold text-base md:text-lg'}>Lightning Fast</h3>
                    <p className={theme === 'light' ? 'text-charcoal/80 text-sm md:text-base' : 'text-slate-400 text-sm md:text-base'}>
                    Find what you need instantly with powerful search and
                    filtering.
                  </p>
                </div>
              </div>
            </div>
            {/* Feature highlights instead of fake stats */}
              <div className={theme === 'light' ? 'grid grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-200 animate-slide-up delay-700' : 'grid grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-700/50 animate-slide-up delay-700'}>
              <div className="text-center group">
                  <div className={theme === 'light' ? 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white border-2 border-accentPurple rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300' : 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300'}>
                    <Bookmark className={theme === 'light' ? 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-accentPurple' : 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-400'} />
                </div>
                  <div className={theme === 'light' ? 'text-xs md:text-sm text-charcoal/80 font-medium' : 'text-xs md:text-sm text-slate-300 font-medium'}>
                  Save Anything
                </div>
              </div>
              <div className="text-center group">
                  <div className={theme === 'light' ? 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white border-2 border-blue-400 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300' : 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300'}>
                    <Search className={theme === 'light' ? 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-600' : 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-400'} />
                </div>
                  <div className={theme === 'light' ? 'text-xs md:text-sm text-charcoal/80 font-medium' : 'text-xs md:text-sm text-slate-300 font-medium'}>
                  Find Instantly
                </div>
              </div>
              <div className="text-center group">
                  <div className={theme === 'light' ? 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white border-2 border-green-400 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300' : 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300'}>
                    <Globe className={theme === 'light' ? 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-green-600' : 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-green-400'} />
                </div>
                  <div className={theme === 'light' ? 'text-xs md:text-sm text-charcoal/80 font-medium' : 'text-xs md:text-sm text-slate-300 font-medium'}>
                  Access Anywhere
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced Sign in form */}
          <div className="flex justify-center animate-scale-in delay-800 order-1 lg:order-2 w-full">
              <div className={
                theme === 'light'
                  ? 'flex flex-col items-center justify-center w-full max-w-[95vw] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-4 sm:mt-0 p-2 sm:p-4 md:p-6 lg:p-8 bg-white/40 backdrop-blur-2xl shadow-2xl border border-white/30 ring-1 ring-white/40 rounded-3xl overflow-hidden box-border'
                  : 'flex flex-col items-center justify-center w-full max-w-[95vw] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-4 sm:mt-0 p-2 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl backdrop-blur-xl shadow-2xl border border-white/20 overflow-hidden box-border'
              }>
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary:
                        theme === 'light'
                          ? 'bg-white border-2 border-charcoal text-charcoal font-bold py-3 rounded-lg shadow-md hover:bg-gray-50 transition text-xs sm:text-sm md:text-base'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-xs sm:text-sm md:text-base',
                      card: 'bg-transparent shadow-none w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto',
                      headerTitle:
                        theme === 'light'
                          ? 'text-charcoal text-lg sm:text-xl md:text-2xl font-bold'
                          : 'text-white text-lg sm:text-xl md:text-2xl font-bold',
                      headerSubtitle:
                        theme === 'light'
                          ? 'text-charcoal/80 text-xs sm:text-sm md:text-base'
                          : 'text-slate-300 text-xs sm:text-sm md:text-base',
                    socialButtonsBlockButton:
                        theme === 'light'
                          ? 'bg-white border-2 border-charcoal text-charcoal hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base'
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base',
                    socialButtonsBlockButtonText:
                        theme === 'light'
                          ? 'text-charcoal font-medium text-xs sm:text-sm md:text-base'
                          : 'text-white font-medium text-xs sm:text-sm md:text-base',
                    formFieldInput:
                        theme === 'light'
                          ? 'bg-white border-2 border-slate-200 text-charcoal placeholder-slate-400 focus:border-accentPurple focus:ring-accentPurple transition-all duration-300 text-xs sm:text-sm md:text-base'
                          : 'bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300 text-xs sm:text-sm md:text-base',
                    formFieldLabel:
                        theme === 'light'
                          ? 'text-charcoal font-medium text-xs sm:text-sm md:text-base'
                          : 'text-white font-medium text-xs sm:text-sm md:text-base',
                    footerActionLink:
                        theme === 'light'
                          ? 'text-accentPurple font-semibold hover:underline transition-colors duration-300 text-xs sm:text-sm md:text-base'
                          : 'text-purple-400 hover:text-purple-300 transition-colors duration-300 text-xs sm:text-sm md:text-base',
                      identityPreviewText:
                        theme === 'light'
                          ? 'text-charcoal text-xs sm:text-sm md:text-base'
                          : 'text-white text-xs sm:text-sm md:text-base',
                    identityPreviewEditButton:
                        theme === 'light'
                          ? 'text-accentPurple font-semibold hover:underline transition-colors duration-300 text-xs sm:text-sm md:text-base'
                          : 'text-purple-400 hover:text-purple-300 transition-colors duration-300 text-xs sm:text-sm md:text-base',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default SignInPage;
