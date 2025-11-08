import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

interface LandingNavProps {
  onSignInClick: () => void;
}

export function LandingNav({ onSignInClick }: LandingNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#0F172A]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>InterviewAI</span>
          </div>
          <Button 
            onClick={onSignInClick}
            variant="outline"
            className="border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5"
          >
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}
