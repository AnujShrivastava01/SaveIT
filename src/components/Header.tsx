
import { BookOpen } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  console.log('Header component rendering...');
  const isClerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SaveIt</h1>
              <p className="text-slate-400 text-sm">Your personal link & note organizer</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isClerkConfigured ? (
              <>
                <SignedOut>
                  <SignInButton>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </>
            ) : (
              <Button disabled className="bg-gray-500 cursor-not-allowed">
                Auth Disabled
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
