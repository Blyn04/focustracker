import React from "react";
import "../styles/Stats.css";

interface StatsProps {
  totalMinutes: number;
  streak: number;
}

function Stats({ totalMinutes, streak }: StatsProps) {
  return (
    <div className="stats">
      <h3>📊 Your Stats</h3>
      <p>
        <strong>Total Focus Time:</strong> {totalMinutes.toFixed(2)} minutes
      </p>
      <p>
        <strong>🔥 Current Streak:</strong> {streak} day{streak !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default Stats;
