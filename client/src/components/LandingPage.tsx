import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { LandingNav } from "./LandingNav";
import { CheckCircle2, BarChart3, Clock, Target, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onSignInClick: () => void;
}

export function LandingPage({ onSignInClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white">
      <LandingNav onSignInClick={onSignInClick} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/20 mb-6">
              <Zap className="w-4 h-4 text-[#0D9488]" />
              <span className="text-sm text-[#0D9488]">AI-Powered Interview Coach</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
              Stop guessing.
              <br />
              <span className="bg-gradient-to-r from-[#0D9488] to-[#14B8A6] bg-clip-text text-transparent">
                Start improving.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-[#64748B] mb-8 max-w-2xl mx-auto">
              Get instant, expert AI feedback on your interview answers. Practice with confidence and land your dream job.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onSignInClick}
                size="lg"
                className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-[#E2E8F0] text-[#334155] px-8 py-6 rounded-lg"
              >
                See How It Works
              </Button>
            </div>
            
            <p className="text-sm text-[#64748B] mt-6">
              Start for free with 5 feedback requests per day. No credit card required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              How It Works
            </h2>
            <p className="text-lg text-[#64748B]">
              Three simple steps to interview mastery
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Select Your Role",
                description: "Choose from Software Engineer, Product Manager, Designer, and more. We tailor questions to your career path.",
                icon: Target,
                color: "#0D9488"
              },
              {
                step: "02",
                title: "Record or Type Your Answer",
                description: "Practice answering real interview questions. Type your response or speak naturally - we support both.",
                icon: Clock,
                color: "#14B8A6"
              },
              {
                step: "03",
                title: "Get Actionable Feedback",
                description: "Receive detailed AI feedback based on real hiring metrics. Know exactly what to improve.",
                icon: CheckCircle2,
                color: "#10B981"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-8 border-[#E2E8F0] hover:border-[#0D9488]/30 transition-all hover:shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0D9488]/5 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] mb-6 shadow-md">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="text-5xl mb-4 opacity-20" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: item.color }}>
                      {item.step}
                    </div>
                    
                    <h3 className="text-xl mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      {item.title}
                    </h3>
                    
                    <p className="text-[#64748B] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              Why Choose InterviewAI?
            </h2>
            <p className="text-lg text-[#64748B]">
              Everything you need to ace your next interview
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Based on Real Hiring Metrics",
                description: "Our AI is trained on actual interview evaluation criteria used by top companies. Get feedback that matters.",
                gradient: "from-[#0D9488] to-[#14B8A6]"
              },
              {
                icon: TrendingUp,
                title: "Unlimited Practice",
                description: "Practice as much as you need. Build confidence through repetition and see your progress over time.",
                gradient: "from-[#14B8A6] to-[#10B981]"
              },
              {
                icon: Shield,
                title: "Track Your Progress",
                description: "Review your history, see rating trends, and identify patterns in your interview performance.",
                gradient: "from-[#10B981] to-[#0D9488]"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 border-[#E2E8F0] hover:border-[#0D9488]/30 transition-all h-full group hover:shadow-lg">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} mb-5 shadow-sm group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-[#64748B] leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 border-[#0D9488]/20 bg-gradient-to-br from-white to-[#0D9488]/5">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Start Practicing Today
              </h2>
              
              <p className="text-lg text-[#64748B] mb-2">
                Get started for free with
              </p>
              
              <div className="text-5xl mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D9488' }}>
                5 feedbacks/day
              </div>
              
              <p className="text-[#64748B] mb-8 max-w-md mx-auto">
                No credit card required. Upgrade anytime for unlimited practice sessions and advanced analytics.
              </p>
              
              <Button 
                onClick={onSignInClick}
                size="lg"
                className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white px-10 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Create Free Account
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#0F172A]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>InterviewAI</span>
            </div>
            
            <div className="flex gap-8 text-sm text-[#64748B]">
              <button className="hover:text-[#0D9488] transition-colors">Privacy Policy</button>
              <button className="hover:text-[#0D9488] transition-colors">Terms of Service</button>
              <button className="hover:text-[#0D9488] transition-colors">Contact</button>
            </div>
            
            <p className="text-sm text-[#64748B]">
              © 2025 InterviewAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
