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
  id: string;
  date: string;
  jobTrack: string;
  question: string;
  rating: number;
  answer: string;
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    date: "November 8, 2025",
    jobTrack: "Software Engineer",
    question: "Tell me about a time you faced a difficult technical challenge. How did you approach it?",
    rating: 4,
    answer: "In my previous role, I encountered a critical performance issue..."
  },
  {
    id: "2",
    date: "November 7, 2025",
    jobTrack: "Product Manager",
    question: "How do you prioritize features when you have competing stakeholder demands?",
    rating: 5,
    answer: "I use a framework that combines business value, user impact, and technical effort..."
  },
  {
    id: "3",
    date: "November 7, 2025",
    jobTrack: "Software Engineer",
    question: "Describe your process for code reviews.",
    rating: 3,
    answer: "I focus on code quality, maintainability, and team learning..."
  },
];

export function MyHistory({ userEmail, onNavigate, onLogout }: MyHistoryProps) {
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

          {/* Stats Overview */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">Total Sessions</p>
                <Star className="w-5 h-5 text-[#F59E0B]" fill="#F59E0B" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {mockHistory.length}
              </p>
            </Card>

            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">Average Rating</p>
                <Star className="w-5 h-5 text-[#10B981]" fill="#10B981" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {(mockHistory.reduce((sum, item) => sum + item.rating, 0) / mockHistory.length).toFixed(1)}
              </p>
            </Card>

            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">This Week</p>
                <Calendar className="w-5 h-5 text-[#0D9488]" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {mockHistory.length}
              </p>
            </Card>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {mockHistory.map((item, index) => (
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
                        <Badge variant="outline" className="border-[#0D9488] text-[#0D9488]">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {item.jobTrack}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-[#64748B]">
                          <Calendar className="w-4 h-4" />
                          {item.date}
                        </div>
                      </div>

                      {/* Question */}
                      <div>
                        <h3 className="text-lg mb-2 text-[#0F172A]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                          {item.question}
                        </h3>
                        <p className="text-[#64748B] line-clamp-2">
                          {item.answer}
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
                                fill={star <= item.rating ? getRatingColor(item.rating) : "none"}
                                stroke={star <= item.rating ? getRatingColor(item.rating) : "#E2E8F0"}
                              />
                            ))}
                          </div>
                          <span 
                            className="text-sm px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: `${getRatingColor(item.rating)}15`, 
                              color: getRatingColor(item.rating) 
                            }}
                          >
                            {getRatingText(item.rating)}
                          </span>
                        </div>
                      </div>
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
            ))}
          </div>

          {/* Empty State (if needed) */}
          {mockHistory.length === 0 && (
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
