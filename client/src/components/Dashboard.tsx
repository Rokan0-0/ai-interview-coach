import { DashboardSidebar } from "./DashboardSidebar";
import { JobTrackCard } from "./JobTrackCard";
import { Code2, Briefcase, Palette, LineChart, Users, Database } from "lucide-react";

interface DashboardProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onSelectJobTrack: (track: string) => void;
}

const jobTracks = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    icon: Code2,
    description: "Practice coding interviews, system design, and technical problem-solving.",
    gradient: "from-[#0D9488] to-[#14B8A6]"
  },
  {
    id: "product-manager",
    title: "Product Manager",
    icon: Briefcase,
    description: "Master product strategy, metrics, and stakeholder communication questions.",
    gradient: "from-[#14B8A6] to-[#10B981]"
  },
  {
    id: "designer",
    title: "UX/UI Designer",
    icon: Palette,
    description: "Prepare for design critiques, portfolio reviews, and process questions.",
    gradient: "from-[#10B981] to-[#0D9488]"
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    icon: LineChart,
    description: "Practice SQL, data interpretation, and analytics case interviews.",
    gradient: "from-[#0D9488] to-[#14B8A6]"
  },
  {
    id: "marketing",
    title: "Marketing Manager",
    icon: Users,
    description: "Prepare for campaign strategy, metrics, and growth questions.",
    gradient: "from-[#14B8A6] to-[#10B981]"
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    icon: Database,
    description: "Practice data pipeline, ETL, and infrastructure questions.",
    gradient: "from-[#10B981] to-[#0D9488]"
  },
];

export function Dashboard({ userEmail, onNavigate, onLogout, onSelectJobTrack }: DashboardProps) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar 
        currentPage="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
        userEmail={userEmail}
      />
      
      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl lg:text-4xl mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              What are you practicing for?
            </h1>
            <p className="text-lg text-[#64748B]">
              Choose your career track to get started with tailored interview questions
            </p>
          </div>
          
          {/* Job Track Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobTracks.map((track) => (
              <JobTrackCard
                key={track.id}
                title={track.title}
                icon={track.icon}
                description={track.description}
                gradient={track.gradient}
                onClick={() => onSelectJobTrack(track.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
