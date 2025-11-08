import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { DashboardSidebar } from "./DashboardSidebar";
import { ArrowLeft, Loader2, Star, RefreshCw, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InterviewPracticeProps {
  userEmail: string;
  jobTrack: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUsageLimitUpdate: (used: number) => void;
}

interface Feedback {
  rating: number;
  feedback: string[];
}

const questions = [
  "Tell me about a time you faced a difficult technical challenge. How did you approach it?",
  "Describe a situation where you had to work with a difficult team member. How did you handle it?",
  "What's your process for learning a new technology or framework?",
  "Tell me about a project you're most proud of. What was your role and what was the outcome?",
  "Describe a time when you had to make a trade-off between perfect code and shipping on time.",
];

export function InterviewPractice({ userEmail, jobTrack, onNavigate, onLogout, onUsageLimitUpdate }: InterviewPracticeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock feedback generation
    const mockRating = Math.floor(Math.random() * 2) + 3; // 3-5
    const mockFeedback: Feedback = {
      rating: mockRating,
      feedback: [
        "Strong opening that clearly sets the context and your role in the situation.",
        "Good use of specific examples and metrics to demonstrate impact.",
        mockRating >= 4 
          ? "Excellent reflection on lessons learned and how you applied them."
          : "Consider adding more detail about the challenges you faced and how you overcame them.",
        mockRating === 5
          ? "Outstanding answer that demonstrates leadership and technical depth."
          : "Try to be more specific about the technical decisions you made and why."
      ]
    };
    
    setFeedback(mockFeedback);
    setIsLoading(false);
    onUsageLimitUpdate(1);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((currentQuestionIndex + 1) % questions.length);
    setAnswer("");
    setFeedback(null);
  };

  const handleTryAgain = () => {
    setAnswer("");
    setFeedback(null);
  };

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
        currentPage="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
        userEmail={userEmail}
      />
      
      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Button
            variant="ghost"
            className="mb-8 text-[#0D9488] hover:bg-[#0D9488]/10"
            onClick={() => onNavigate("dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Job Title */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0D9488]/10 to-[#14B8A6]/10 border border-[#0D9488]/20 mb-4">
              <Sparkles className="w-4 h-4 text-[#0D9488]" />
              <span className="text-sm text-[#0D9488]">
                {jobTrack.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
            <h1 className="text-3xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              Interview Practice
            </h1>
            <p className="text-[#64748B]">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          {/* Question Card */}
          <Card className="p-8 mb-6 border-[#E2E8F0] bg-gradient-to-br from-white to-[#0D9488]/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  Q
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                  {currentQuestion}
                </h2>
              </div>
            </div>
          </Card>

          <AnimatePresence mode="wait">
            {!feedback ? (
              // Answering State
              <motion.div
                key="answering"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="p-8 border-[#E2E8F0]">
                  <label className="block mb-3 text-[#334155]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                    Your Answer
                  </label>
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here... Be specific, use examples, and explain your thought process."
                    className="min-h-[300px] resize-none border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488] text-base leading-relaxed"
                    disabled={isLoading}
                  />
                  <p className="mt-3 text-sm text-[#64748B]">
                    Tip: Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
                  </p>
                </Card>

                <div className="flex justify-center">
                  <Button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || isLoading}
                    size="lg"
                    className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white px-12 py-6 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Analyzing your answer...
                      </>
                    ) : (
                      <>
                        Get Feedback
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Feedback State
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Your Answer Card */}
                <Card className="p-8 border-[#E2E8F0]">
                  <h3 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    Your Answer
                  </h3>
                  <p className="text-[#334155] leading-relaxed whitespace-pre-wrap bg-[#F8FAFC] p-6 rounded-lg border border-[#E2E8F0]">
                    {answer}
                  </p>
                </Card>

                {/* Feedback Card */}
                <Card className="p-8 border-[#0D9488]/20 bg-gradient-to-br from-white to-[#0D9488]/5">
                  <h3 className="text-2xl mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    Here's your feedback
                  </h3>

                  {/* Rating */}
                  <div className="mb-6 p-6 rounded-xl bg-white/50 border border-[#E2E8F0]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#64748B]">Overall Rating</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: getRatingColor(feedback.rating) }}>
                          {feedback.rating}/5
                        </span>
                        <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${getRatingColor(feedback.rating)}15`, color: getRatingColor(feedback.rating) }}>
                          {getRatingText(feedback.rating)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.div
                          key={star}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: star * 0.1, type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <Star
                            className="w-8 h-8"
                            fill={star <= feedback.rating ? getRatingColor(feedback.rating) : "none"}
                            stroke={star <= feedback.rating ? getRatingColor(feedback.rating) : "#E2E8F0"}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Points */}
                  <div className="space-y-4">
                    <h4 className="text-lg mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      Detailed Feedback
                    </h4>
                    {feedback.feedback.map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex gap-4 p-4 rounded-lg bg-white/50 border border-[#E2E8F0]"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-[#334155] leading-relaxed flex-1">
                          {point}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleNextQuestion}
                    size="lg"
                    className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    Next Question
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    size="lg"
                    className="border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5 px-8 py-6"
                  >
                    <RefreshCw className="w-5 h-5 mr-3" />
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
