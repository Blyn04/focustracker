import React from "react";
import { Calendar, Badge, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "antd/dist/reset.css";

interface FocusDay {
  date: string;
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
    if (!minutes) return "default"; 
    if (level !== undefined) {
      if (level >= 4) return "success"; 
      if (level >= 2) return "warning"; 
      return "error";
    }

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
    <div
      className="focus-calendar-wrapper"
      style={{
        marginTop: "2rem",
        width: "500px", 
        height: "550px",
      }}
    >
      <h3 style={{ textAlign: "center" }}>📅 Focus Calendar</h3>
      <Calendar
        dateCellRender={dateCellRender}
        fullscreen={false} 
      />
    </div>
  );
};

export default FocusCalendar;
