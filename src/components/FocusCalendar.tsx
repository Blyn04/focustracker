// src/components/FocusCalendar.tsx
import React from "react";
import { Calendar, Badge, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "antd/dist/reset.css";

interface FocusDay {
  date: string; // "YYYY-MM-DD"
  minutes: number;
  avgFocusLevel?: number;
}

interface FocusCalendarProps {
  history: FocusDay[];
}

const FocusCalendar: React.FC<FocusCalendarProps> = ({ history }) => {
  const getDayData = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    return history.find((h) => h.date === dateStr);
  };

  const getBadgeStatus = (minutes: number, level?: number) => {
    if (!minutes) return "default"; // gray = no data
    if (level !== undefined) {
      if (level >= 4) return "success"; // green = high focus
      if (level >= 2) return "warning"; // orange = medium focus
      return "error"; // red = low focus
    }
    // fallback by minutes
    if (minutes >= 60) return "success";
    if (minutes >= 30) return "warning";
    return "error";
  };

  const dateCellRender = (value: Dayjs) => {
    const data = getDayData(value);
    if (!data) return null;

    const status = getBadgeStatus(data.minutes, data.avgFocusLevel);
    const tooltipText = `${data.minutes} min, Focus Level: ${data.avgFocusLevel ?? "-"}`;

    return (
      <Tooltip title={tooltipText}>
        <Badge status={status} text={value.date()} />
      </Tooltip>
    );
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>📅 Focus Calendar</h3>
      <Calendar dateCellRender={dateCellRender} />
    </div>
  );
};

export default FocusCalendar;
