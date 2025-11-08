import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthModal } from "./components/AuthModal";
import { Dashboard } from "./components/Dashboard";
import { InterviewPractice } from "./components/InterviewPractice";
import { MyAccount } from "./components/MyAccount";
import { MyHistory } from "./components/MyHistory";
import { AdminDashboard } from "./components/AdminDashboard";
import { Toaster } from "./components/ui/sonner";

type Page = "landing" | "dashboard" | "practice" | "account" | "history" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null);
  const [selectedJobTrack, setSelectedJobTrack] = useState<string>("");
  const [usageCount, setUsageCount] = useState(3); // Mock: 3 out of 5 used
  const [usageLimit] = useState(5);

  const handleAuthenticated = (email: string) => {
    // Mock: admin@example.com gets admin access
    const isAdmin = email === "admin@example.com";
    setUser({ email, isAdmin });
    setCurrentPage(isAdmin ? "admin" : "dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("landing");
    setSelectedJobTrack("");
  };

  const handleSelectJobTrack = (track: string) => {
    setSelectedJobTrack(track);
    setCurrentPage("practice");
  };

  const handleNavigate = (page: string) => {
    if (page === "dashboard") {
      setCurrentPage("dashboard");
      setSelectedJobTrack("");
    } else if (page === "account") {
      setCurrentPage("account");
    } else if (page === "history") {
      setCurrentPage("history");
    }
  };

  const handleUsageLimitUpdate = (increment: number) => {
    setUsageCount(prev => Math.min(prev + increment, usageLimit));
  };

  return (
    <div className="min-h-screen">
      {currentPage === "landing" && !user && (
        <LandingPage onSignInClick={() => setIsAuthModalOpen(true)} />
      )}

      {currentPage === "dashboard" && user && !user.isAdmin && (
        <Dashboard
          userEmail={user.email}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onSelectJobTrack={handleSelectJobTrack}
        />
      )}

      {currentPage === "practice" && user && selectedJobTrack && (
        <InterviewPractice
          userEmail={user.email}
          jobTrack={selectedJobTrack}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onUsageLimitUpdate={handleUsageLimitUpdate}
        />
      )}

      {currentPage === "account" && user && (
        <MyAccount
          userEmail={user.email}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          usageCount={usageCount}
          usageLimit={usageLimit}
        />
      )}

      {currentPage === "history" && user && (
        <MyHistory
          userEmail={user.email}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "admin" && user && user.isAdmin && (
        <AdminDashboard
          userEmail={user.email}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      <Toaster />
    </div>
  );
}
