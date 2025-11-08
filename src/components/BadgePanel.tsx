import React, { useState } from "react";
import "../styles/BadgePanel.css";

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

interface BadgePanelProps {
  earnedBadges: string[];
}

const ALL_BADGES: Omit<Badge, "earned">[] = [
  { id: "100Minutes", name: "100 Minutes Focus", description: "Focus for 100 total minutes" },
  { id: "7DayStreak", name: "7-Day Streak", description: "Focus 7 days in a row" },
  { id: "5SessionsDay", name: "5 Sessions in a Day", description: "Complete 5 sessions in one day" },
];

const BadgePanel: React.FC<BadgePanelProps> = ({ earnedBadges }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges: Badge[] = ALL_BADGES.map((b) => ({
    ...b,
    earned: earnedBadges.includes(b.name),
  }));

  return (
    <div className="badge-panel">
      <h3>🏆 Achievements</h3>
      <div className="badge-grid">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`badge ${badge.earned ? "earned" : "locked"}`}
            onClick={() => setSelectedBadge(badge)}
          >
            <span role="img" aria-label="badge">🏅</span>
            <p>{badge.name}</p>
          </div>
        ))}
      </div>

      {selectedBadge && (
        <div className="badge-info">
          <h4>{selectedBadge.name}</h4>
          <p>{selectedBadge.description}</p>
          {!selectedBadge.earned && <p style={{ color: "grey" }}>Not achieved yet</p>}
          <button onClick={() => setSelectedBadge(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default BadgePanel;
