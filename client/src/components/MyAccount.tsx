import { DashboardSidebar } from "./DashboardSidebar";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { User, Mail, Calendar, Zap, TrendingUp } from "lucide-react";

interface MyAccountProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  usageCount: number;
  usageLimit: number;
}

export function MyAccount({ userEmail, onNavigate, onLogout, usageCount, usageLimit }: MyAccountProps) {
  const usagePercentage = (usageCount / usageLimit) * 100;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar 
        currentPage="account"
        onNavigate={onNavigate}
        onLogout={onLogout}
        userEmail={userEmail}
      />
      
      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              My Account
            </h1>
            <p className="text-[#64748B]">
              Manage your account settings and view your usage
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-8 border-[#E2E8F0]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      Profile Information
                    </h2>
                    <Badge variant="outline" className="border-[#0D9488] text-[#0D9488]">
                      Free Plan
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <Mail className="w-5 h-5 text-[#64748B]" />
                  <div className="flex-1">
                    <p className="text-sm text-[#64748B] mb-1">Email Address</p>
                    <p className="text-[#334155]">{userEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <Calendar className="w-5 h-5 text-[#64748B]" />
                  <div className="flex-1">
                    <p className="text-sm text-[#64748B] mb-1">Member Since</p>
                    <p className="text-[#334155]">November 8, 2025</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Usage Card */}
            <Card className="p-8 border-[#0D9488]/20 bg-gradient-to-br from-white to-[#0D9488]/5">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    Daily Feedback Usage
                  </h2>
                  <p className="text-[#64748B]">
                    Track your daily feedback requests
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-4xl mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: usagePercentage >= 80 ? '#EF4444' : '#0D9488' }}>
                      {usageCount} / {usageLimit}
                    </div>
                    <p className="text-sm text-[#64748B]">
                      Feedback requests used today
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      usagePercentage >= 80 
                        ? 'border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10' 
                        : 'border-[#10B981] text-[#10B981] bg-[#10B981]/10'
                    }`}
                  >
                    {usageLimit - usageCount} remaining
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Progress 
                    value={usagePercentage} 
                    className="h-3"
                  />
                  <p className="text-xs text-[#64748B]">
                    {usagePercentage.toFixed(0)}% of daily limit used
                  </p>
                </div>

                {usagePercentage >= 80 && (
                  <div className="p-4 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#F59E0B] mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                          You're running low on feedback requests
                        </p>
                        <p className="text-sm text-[#64748B]">
                          Upgrade to unlimited to continue practicing without limits
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <p className="text-sm text-[#64748B]">
                    Your usage limit resets daily at midnight UTC
                  </p>
                </div>
              </div>
            </Card>

            {/* Plan Details */}
            <Card className="p-8 border-[#E2E8F0]">
              <h2 className="text-xl mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Plan Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <p className="text-[#334155] mb-1">Current Plan</p>
                    <p className="text-sm text-[#64748B]">Free tier with daily limits</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white border-0">
                    FREE
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <p className="text-sm text-[#64748B] mb-1">Feedback Requests</p>
                    <p className="text-xl text-[#334155]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      {usageLimit}/day
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <p className="text-sm text-[#64748B] mb-1">Job Tracks</p>
                    <p className="text-xl text-[#334155]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      All Available
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
