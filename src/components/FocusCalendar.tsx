// src/components/FocusCalendar.tsx
import React from "react";
import "../styles/FocusCalendar.css";

interface FocusDay {
  date: string; // "YYYY-MM-DD"
  minutes: number;
  avgFocusLevel?: number;
}

interface FocusCalendarProps {
  history: FocusDay[];
}

const FocusCalendar: React.FC<FocusCalendarProps> = ({ history }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // First day of month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysArray = Array.from({ length: lastDay.getDate() }, (_, i) => i + 1);

  const getDayData = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    return history.find((h) => h.date === dateStr);
  };

  const getColor = (minutes: number, level?: number) => {
    // Adjust colors based on minutes or focus level
    if (!minutes) return "#f0f0f0"; // gray = no data
    if (level) {
      if (level >= 4) return "#4caf50"; // green = high focus
      if (level >= 2) return "#ff9800"; // orange = medium focus
      return "#f44336"; // red = low focus
    }
    // fallback by minutes
    if (minutes >= 60) return "#4caf50";
    if (minutes >= 30) return "#ff9800";
    return "#f44336";
  };

  return (
    <div className="focus-calendar">
      <h3>📅 Focus Calendar ({today.toLocaleString("default", { month: "long" })})</h3>
      <div className="calendar-grid">
        {daysArray.map((day) => {
          const data = getDayData(day);
          const color = data ? getColor(data.minutes, data.avgFocusLevel) : "#f0f0f0";
          return (
            <div
              key={day}
              className="calendar-day"
              style={{ backgroundColor: color }}
              title={
                data
                  ? `${day}/${month + 1}: ${data.minutes} min, Focus Level: ${data.avgFocusLevel ?? "-"}`
                  : `${day}/${month + 1}: No data`
              }
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FocusCalendar;
