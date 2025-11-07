import React from "react";
import "../styles/Stats.css";

interface StatsProps {
  totalMinutes: number;
}

const Stats: React.FC<StatsProps> = ({ totalMinutes }) => {
  return (
    <div className="stats">
      <h3>Total Focus Time</h3>
      <p>{totalMinutes} minutes</p>
    </div>
  );
};

export default Stats;
