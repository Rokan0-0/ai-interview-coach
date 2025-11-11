import React, { useState, useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { JobTrackCard } from "./JobTrackCard";
import { Code2, Briefcase, Palette, LineChart, Users, Database } from "lucide-react";

interface DashboardProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onSelectJobTrack: (trackId: number, trackName: string) => void;
}

interface Track {
  id: number;
  name: string;
}

const trackMetadata: Record<string, { icon: typeof Code2; description: string; gradient: string }> = {
  "Software Engineer": {
    icon: Code2,
    description: "Practice coding interviews, system design, and technical problem-solving.",
    gradient: "from-[#0D9488] to-[#14B8A6]"
  },
  "Product Manager": {
    icon: Briefcase,
    description: "Master product strategy, metrics, and stakeholder communication questions.",
    gradient: "from-[#14B8A6] to-[#10B981]"
  },
  "UX/UI Designer": {
    icon: Palette,
    description: "Prepare for design critiques, portfolio reviews, and process questions.",
    gradient: "from-[#10B981] to-[#0D9488]"
  },
  "Data Analyst": {
    icon: LineChart,
    description: "Practice SQL, data interpretation, and analytics case interviews.",
    gradient: "from-[#0D9488] to-[#14B8A6]"
  },
  "Marketing Manager": {
    icon: Users,
    description: "Prepare for campaign strategy, metrics, and growth questions.",
    gradient: "from-[#14B8A6] to-[#10B981]"
  },
  "Data Engineer": {
    icon: Database,
    description: "Practice data pipeline, ETL, and infrastructure questions.",
    gradient: "from-[#10B981] to-[#0D9488]"
  },
};

export function Dashboard({ userEmail, onNavigate, onLogout, onSelectJobTrack }: DashboardProps) { // The props type will need to be updated in the parent component (App.tsx)
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        setError('No authentication token found');
        return;
      }

      try {
        const response = await fetch('import.meta.env.VITE_API_URL/api/tracks', {
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
          throw new Error('Failed to fetch tracks');
        }

        const data = await response.json();
        setTracks(data);
      } catch (err) {
        console.error('Error fetching tracks:', err);
        setError('Failed to fetch tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);
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
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-lg text-[#64748B]">Loading tracks...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}

          {/* Job Track Grid */}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track) => {
                const metadata = trackMetadata[track.name] || {
                  icon: Briefcase,
                  description: "Practice interview questions for this track.",
                  gradient: "from-[#0D9488] to-[#14B8A6]"
                };
                return (
                  <JobTrackCard
                    key={track.id}
                    title={track.name}
                    icon={metadata.icon}
                    description={metadata.description}
                    gradient={metadata.gradient}
                    onClick={() => onSelectJobTrack(track.id, track.name)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
