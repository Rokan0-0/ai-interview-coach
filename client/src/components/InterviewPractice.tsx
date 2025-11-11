import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { DashboardSidebar } from "./DashboardSidebar";
import { ArrowLeft, Loader2, Star, RefreshCw, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InterviewPracticeProps {
  userEmail: string;
  trackId: number;
  trackName: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUsageLimitUpdate: (used: number) => void;
}

interface Feedback {
  rating: number;
  feedback: string[];
}

interface Question {
  id: number;
  text: string;
}

export function InterviewPractice({ userEmail, trackId, trackName, onNavigate, onLogout, onUsageLimitUpdate }: InterviewPracticeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tracks/${trackId}/questions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        
        // Security: Check if questions array is empty
        if (!Array.isArray(data) || data.length === 0) {
          setError('No questions available for this track.');
          setQuestions([]);
          return;
        }
        
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions');
        setQuestions([]); // Ensure questions is empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [trackId]);

  // Security: Check if currentQuestion exists before accessing it
  const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length 
    ? questions[currentQuestionIndex] 
    : null;

  const handleSubmitAnswer = async () => {
    // Security: Prevent double submission and validate inputs
    if (!answer.trim() || !currentQuestion || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answerText: answer.trim()
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        if (response.status === 429) {
          const errorData = await response.json().catch(() => ({ error: 'Rate limit exceeded' }));
          setError(errorData.error || 'You have exceeded your daily limit. Please try again tomorrow.');
          return;
        }
        const errorData = await response.json().catch(() => ({ error: 'Failed to submit answer' }));
        throw new Error(errorData.error || 'Failed to submit answer');
      }

      const data = await response.json();
      setFeedback(data);
      onUsageLimitUpdate(1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    // Security: Check if questions array is valid
    if (questions.length === 0) {
      setError('No questions available');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Clear all state when moving to next question
      setAnswer("");
      setFeedback(null);
      setError(null);
    } else {
      // Last question - navigate to results (for now, just log)
      console.log('End of interview');
      // TODO: Navigate to results page when implemented
      // navigate('/results');
    }
  };

  const handleTryAgain = () => {
    // Clear answer and feedback, but keep error state
    setAnswer("");
    setFeedback(null);
    // Note: We keep error state so user knows if there was an issue
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
                {trackName}
              </span>
            </div>
            <h1 className="text-3xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              Interview Practice
            </h1>
            <p className="text-[#64748B]">
              {questions.length > 0 
                ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
                : 'No questions available'}
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
                  {isLoading ? "Loading question..." : currentQuestion?.text || "No question available"}
                </h2>
              </div>
            </div>
          </Card>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {isLoading && questions.length === 0 ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#0D9488]" />
              <p className="text-[#64748B]">Loading questions...</p>
            </div>
          ) : (
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
                      disabled={isSubmitting}
                    />
                    <p className="mt-3 text-sm text-[#64748B]">
                      Tip: Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
                    </p>
                  </Card>

                  <div className="flex justify-center">
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim() || isSubmitting || !currentQuestion}
                      size="lg"
                      className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white px-12 py-6 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Analyzing your answer...
                        </>
                      ) : (
                        <>
                          Submit Answer
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
          )}
        </div>
      </main>
    </div>
  );
}
