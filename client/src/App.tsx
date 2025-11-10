import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { AuthModal } from "./components/AuthModal";
import { Dashboard } from "./components/Dashboard";
import { InterviewPractice } from "./components/InterviewPractice";
import { MyAccount } from "./components/MyAccount";
import { MyHistory } from "./components/MyHistory";
import { AdminDashboard } from "./components/AdminDashboard";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  // Debug: Check if page is reloading
  useEffect(() => {
    console.log('🔵 App component mounted/re-rendered');
    const reloadCheck = sessionStorage.getItem('app-reload-check');
    if (reloadCheck) {
      console.warn('⚠️ PAGE RELOADED - This indicates a full page refresh happened');
      // Clear it so we only warn once per actual reload
      sessionStorage.removeItem('app-reload-check');
    } else {
      sessionStorage.setItem('app-reload-check', 'true');
      console.log('✅ App loaded normally (not a reload)');
    }
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [selectedTrackName, setSelectedTrackName] = useState<string>("");
  const [usageCount, setUsageCount] = useState(3); // Mock: 3 out of 5 used
  const [usageLimit] = useState(5);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const handleAuthenticated = useCallback((email: string, shouldNavigate: boolean = true) => {
    // Mock: admin@example.com gets admin access
    const isAdmin = email === "admin@example.com";
    setUser({ email, isAdmin });
    if (shouldNavigate) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    console.log('🔵 App useEffect - verifyToken running');
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      console.log('🔵 Token exists:', !!token);
      if (token) {
        try {
          // In a real app, you'd verify the token with the backend.
          // For now, we'll decode it to get the user's email.
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔵 Token payload:', payload);
          // Only navigate if we're not already on a protected route
          const currentPath = window.location.pathname;
          const isOnProtectedRoute = currentPath.startsWith('/dashboard') || 
                                     currentPath.startsWith('/account') || 
                                     currentPath.startsWith('/history') || 
                                     currentPath.startsWith('/practice') || 
                                     currentPath.startsWith('/admin');
          handleAuthenticated(payload.email, !isOnProtectedRoute);
        } catch (error) {
          console.error("❌ Failed to decode token:", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
      console.log('🔵 Loading set to false');
    };

    verifyToken();
    // Only run once on mount, not on every handleAuthenticated change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Catch any unhandled errors
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('❌ Unhandled error:', event.error);
      console.error('❌ Error message:', event.message);
      console.error('❌ Error stack:', event.error?.stack);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      try {
        // Save the token
        localStorage.setItem('token', token);
        
        // Decode the token to get user email
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Authenticate the user (navigate to dashboard)
        handleAuthenticated(payload.email, true);
        
        // Clean up the URL by removing the token parameter
        window.history.replaceState({}, document.title, '/auth/callback');
      } catch (error) {
        console.error("Failed to process OAuth callback:", error);
        navigate('/');
      }
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSelectedTrackId(null);
    setSelectedTrackName("");
    navigate("/");
  };

  const handleSelectJobTrack = (trackId: number, trackName: string) => {
    console.log('🔵 handleSelectJobTrack called:', trackId, trackName);
    setSelectedTrackId(trackId);
    setSelectedTrackName(trackName);
    console.log('🔵 Navigating to /practice');
    navigate("/practice");
  };

  const handleNavigate = (path: string) => {
    console.log('🔵 handleNavigate called with path:', path);
    console.log('🔵 Current location:', window.location.pathname);
    
    if (path === "dashboard") {
      setSelectedTrackId(null);
    }
    
    try {
      navigate(`/${path}`);
      console.log('✅ Navigation successful to:', `/${path}`);
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
  };

  const handleUsageLimitUpdate = (increment: number) => {
    setUsageCount(prev => Math.min(prev + increment, usageLimit));
  };

  const commonProps = {
    userEmail: user?.email ?? "",
    onNavigate: handleNavigate,
    onLogout: handleLogout,
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>; // Or a spinner component
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage onSignInClick={() => setIsAuthModalOpen(true)} />} />
        <Route path="/login" element={<LandingPage onSignInClick={() => setIsAuthModalOpen(true)} />} />
        
        {/* OAuth Callback Route */}
        <Route path="/auth/callback" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D9488] mx-auto mb-4"></div>
              <p className="text-[#64748B]">Completing sign in...</p>
            </div>
          </div>
        } />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={
            user?.isAdmin ? <Navigate to="/admin" /> : <Dashboard {...commonProps} onSelectJobTrack={handleSelectJobTrack} />
          } />
          <Route path="/practice" element={
            selectedTrackId && selectedTrackName ? (
              <InterviewPractice {...commonProps} trackId={selectedTrackId} trackName={selectedTrackName} onUsageLimitUpdate={handleUsageLimitUpdate} />
            ) : (
              <Navigate to="/dashboard" />
            )
          } />
          <Route path="/account" element={
            <MyAccount {...commonProps} usageCount={usageCount} usageLimit={usageLimit} />
          } />
          <Route path="/history" element={
            <MyHistory {...commonProps} />
          } />
          
          {/* Admin Route */}
          <Route path="/admin" element={
            user?.isAdmin ? <AdminDashboard {...commonProps} /> : <Navigate to="/dashboard" />
          } />
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      <Toaster />
    </div>
  );
}
