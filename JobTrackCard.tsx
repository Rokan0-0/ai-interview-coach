import * as React from "react";
import { Button } from "./ui/button";

interface JobTrackCardProps {
  title: string;
  description: string;
}

export function JobTrackCard({ title, description }: JobTrackCardProps) {
  return (
    <div className="border rounded-lg p-6 flex flex-col bg-card text-card-foreground">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
      <Button>Start Practicing</Button>
    </div>
  );
}