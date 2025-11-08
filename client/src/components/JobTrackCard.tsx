import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface JobTrackCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  gradient: string;
  onClick: () => void;
}

export function JobTrackCard({ title, icon: Icon, description, gradient, onClick }: JobTrackCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className="p-6 cursor-pointer border-[#E2E8F0] hover:border-[#0D9488]/30 hover:shadow-xl transition-all group overflow-hidden relative"
        onClick={onClick}
      >
        {/* Background decoration */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-500`} />
        
        <div className="relative">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} mb-4 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          <h3 className="text-xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            {title}
          </h3>
          
          <p className="text-[#64748B] leading-relaxed">
            {description}
          </p>
          
          <div className="mt-4 flex items-center text-[#0D9488] opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm">Start practicing</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
