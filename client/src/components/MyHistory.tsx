import { useState, useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { History, Star, Calendar, Briefcase, Eye } from "lucide-react";
import { motion } from "motion/react";

interface MyHistoryProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface HistoryItem {
  id: number;
  answerText: string;
  feedback: string;
  createdAt: string;
  question: {
    text: string;
  };
}

export function MyHistory({ userEmail, onNavigate, onLogout }: MyHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        setError('No authentication token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/answers/my-history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid, clear it and let ProtectedRoute handle redirect
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#10B981";
    if (rating === 3) return "#F59E0B";
    return "#EF4444";
  };

  const getRatingText = (rating: number) => {
    if (rating === 5) return "Excellent";
    if (rating === 4) return "Good";
    if (rating === 3) return "Okay";
    if (rating === 2) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar 
        currentPage="history"
        onNavigate={onNavigate}
        onLogout={onLogout}
        userEmail={userEmail}
      />
      
      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  My History
                </h1>
              </div>
            </div>
            <p className="text-[#64748B]">
              Review your past interview practice sessions and track your progress
            </p>
          </div>

          {/* Loading and Error Messages */}
          {loading && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-600">Loading history...</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

          {/* Stats Overview */}
          {!loading && !error && (
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Card className="p-6 border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#64748B]">Total Sessions</p>
                  <Star className="w-5 h-5 text-[#F59E0B]" fill="#F59E0B" />
                </div>
                <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                  {history.length}
                </p>
              </Card>

              <Card className="p-6 border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#64748B]">Average Rating</p>
                  <Star className="w-5 h-5 text-[#10B981]" fill="#10B981" />
                </div>
                <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                  {history.length > 0 
                    ? (history.reduce((sum, item) => {
                        try {
                          const fb = JSON.parse(item.feedback);
                          return sum + (fb.rating || 0);
                        } catch {
                          return sum;
                        }
                      }, 0) / history.length).toFixed(1)
                    : '0.0'}
                </p>
              </Card>

              <Card className="p-6 border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#64748B]">This Week</p>
                  <Calendar className="w-5 h-5 text-[#0D9488]" />
                </div>
                <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                  {history.filter(item => {
                    const itemDate = new Date(item.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return itemDate >= weekAgo;
                  }).length}
                </p>
              </Card>
            </div>
          )}

          {/* History List */}
          {!loading && !error && (
            <div className="space-y-4">
              {history.map((item, index) => {
                try {
                  const fb = JSON.parse(item.feedback);
                  const rating = fb.rating || 0;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 border-[#E2E8F0] hover:border-[#0D9488]/30 hover:shadow-lg transition-all">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Left side - Main content */}
                          <div className="flex-1 space-y-4">
                            {/* Header */}
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                <Calendar className="w-4 h-4" />
                                {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </div>
                            </div>

                            {/* Question */}
                            <div>
                              <h3 className="text-lg mb-2 text-[#0F172A]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                                {item.question.text}
                              </h3>
                              <p className="text-[#64748B] line-clamp-2">
                                {item.answerText}
                              </p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className="w-4 h-4"
                                      fill={star <= rating ? getRatingColor(rating) : "none"}
                                      stroke={star <= rating ? getRatingColor(rating) : "#E2E8F0"}
                                    />
                                  ))}
                                </div>
                                <span 
                                  className="text-sm px-2 py-1 rounded-full"
                                  style={{ 
                                    backgroundColor: `${getRatingColor(rating)}15`, 
                                    color: getRatingColor(rating) 
                                  }}
                                >
                                  {rating} / 5 - {getRatingText(rating)}
                                </span>
                              </div>
                            </div>

                            {/* Feedback */}
                            {fb.feedback && Array.isArray(fb.feedback) && (
                              <div className="pt-4 border-t border-[#E2E8F0]">
                                <h4 className="text-sm font-semibold text-[#334155] mb-2">Feedback:</h4>
                                <ul className="space-y-1">
                                  {fb.feedback.map((bullet: string, idx: number) => (
                                    <li key={idx} className="text-sm text-[#64748B] flex items-start gap-2">
                                      <span className="text-[#0D9488] mt-1">•</span>
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Right side - Actions */}
                          <div className="flex lg:flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                } catch (parseError) {
                  console.error('Error parsing feedback for item:', item.id, parseError);
                  return null;
                }
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && history.length === 0 && (
            <Card className="p-12 border-[#E2E8F0] text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-6">
                  <History className="w-10 h-10 text-[#64748B]" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  No practice sessions yet
                </h3>
                <p className="text-[#64748B] mb-6">
                  Start practicing to see your history and track your progress over time.
                </p>
                <Button
                  onClick={() => onNavigate("dashboard")}
                  className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                >
                  Start Practicing
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
