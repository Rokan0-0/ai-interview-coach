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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [selectedTrackName, setSelectedTrackName] = useState<string>("");
  const [usageCount, setUsageCount] = useState(3); // Mock: 3 out of 5 used
  const [usageLimit] = useState(5);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const handleAuthenticated = useCallback((email: string) => {
    // Mock: admin@example.com gets admin access
    const isAdmin = email === "admin@example.com";
    setUser({ email, isAdmin });
    navigate(isAdmin ? "/admin" : "/dashboard");
  }, [navigate]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // In a real app, you'd verify the token with the backend.
          // For now, we'll decode it to get the user's email.
          const payload = JSON.parse(atob(token.split('.')[1]));
          handleAuthenticated(payload.email);
        } catch (error) {
          console.error("Failed to decode token:", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [handleAuthenticated]);

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
        
        // Authenticate the user
        handleAuthenticated(payload.email);
        
        // Clean up the URL by removing the token parameter
        window.history.replaceState({}, document.title, '/auth/callback');
      } catch (error) {
        console.error("Failed to process OAuth callback:", error);
        navigate('/');
      }
    }
  }, [handleAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSelectedTrackId(null);
    setSelectedTrackName("");
    navigate("/");
  };

  const handleSelectJobTrack = (trackId: number, trackName: string) => {
    setSelectedTrackId(trackId);
    setSelectedTrackName(trackName);
    navigate("/practice");
  };

  const handleNavigate = (path: string) => {
    if (path === "dashboard") {
      setSelectedTrackId(null);
    }
    navigate(`/${path}`);
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
