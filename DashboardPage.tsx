import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { JobTrackCard } from "../components/JobTrackCard";

interface Track {
  id: string;
  name: string;
  description: string;
}

export function DashboardPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Fetches the list of job tracks from the protected API endpoint.
     */
    const fetchTracks = async () => {
      try {
        // Get the token from localStorage.
        const token = localStorage.getItem("token");

        // If there's no token, redirect to the /login page.
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await apiFetch("/tracks");

        if (!response.ok) {
          // If the response is not OK (e.g., 401 Unauthorized), throw an error.
          throw new Error("Failed to fetch tracks");
        }

        const data = await response.json();
        // When the data comes back, setTracks with the response data.
        setTracks(data);
      } catch (err) {
        // Catch the error and set the error state.
        console.error("Fetch tracks error:", err);
        setError("Could not load job tracks. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [navigate]); // useEffect runs once when the component mounts.

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Available Job Tracks</h1>
      {loading && <p>Loading tracks...</p>}
      {error && <p className="text-destructive">Error: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && tracks.map(track => (
          <JobTrackCard key={track.id} title={track.name} description={track.description} />
        ))}
      </div>
    </div>
  );
}
