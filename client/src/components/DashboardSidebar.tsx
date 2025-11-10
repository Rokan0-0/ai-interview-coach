import { Button } from "./ui/button";
import { Sparkles, LayoutDashboard, History, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userEmail: string;
}

export function DashboardSidebar({ currentPage, onNavigate, onLogout, userEmail }: DashboardSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "history", label: "My History", icon: History },
    { id: "account", label: "My Account", icon: User },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-[#0F172A]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              InterviewAI
            </h2>
            <p className="text-xs text-[#64748B]">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={currentPage === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              currentPage === item.id
                ? "bg-[#0D9488] text-white hover:bg-[#0D9488]/90"
                : "text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0D9488]"
            }`}
            onClick={(e) => {
              console.log('🔵 Sidebar button clicked:', item.id);
              e.preventDefault();
              e.stopPropagation();
              console.log('🔵 Calling onNavigate with:', item.id);
              onNavigate(item.id);
              setMobileMenuOpen(false);
            }}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#E2E8F0]">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLogout();
            setMobileMenuOpen(false);
          }}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="bg-white shadow-lg border-[#E2E8F0]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-[#E2E8F0] h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
