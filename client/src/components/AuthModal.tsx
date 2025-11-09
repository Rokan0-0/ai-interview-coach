import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Mail, Lock, Sparkles } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: (email: string) => void;
}

export function AuthModal({ open, onClose, onAuthenticated }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // Redirect to the server's Google OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleEmailAuth = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        // Step 1: Register
        const registerResponse = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!registerResponse.ok) {
          const registerData = await registerResponse.json();
          throw new Error(registerData.error || 'Registration failed');
        }

        // Step 2: Auto-Login after successful registration
        const loginResponse = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!loginResponse.ok) {
          const loginData = await loginResponse.json();
          throw new Error(loginData.error || 'Auto-login failed');
        }

        const loginData = await loginResponse.json();
        localStorage.setItem('token', loginData.token);
        onAuthenticated(email);
        navigate('/dashboard');
        onClose();
      } else {
        // Login
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        onAuthenticated(email);
        navigate('/dashboard');
        onClose();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            {isRegister ? "Create your account" : "Sign in to your account"}
          </DialogTitle>
          <DialogDescription className="text-center text-[#64748B]">
            {isRegister ? "Start your interview practice journey" : "Welcome back! Continue your practice"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Google Sign In */}
          <Button 
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full py-6 border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#0D9488]/30 transition-all"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-[#64748B]">
              or
            </span>
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#334155]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#334155]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                  disabled={loading}
                />
              </div>
            </div>
            
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#334155]">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <Input 
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                    disabled={loading}
                  />
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D9488] hover:bg-[#0D9488]/90 text-white py-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center">
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-sm text-[#0D9488] hover:underline"
            >
              {isRegister ? "Already have an account? Sign in" : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
