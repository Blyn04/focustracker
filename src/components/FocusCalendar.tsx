import React, { useState } from "react";
import { Calendar, Badge, Tooltip, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "antd/dist/reset.css";

interface FocusDay {
  date: string;
  minutes: number;
  avgFocusLevel?: number;
  sessions?: number; // optional: number of sessions that day
  taskDetails?: { task: string; minutes: number; focusLevel?: number }[];
}

interface FocusCalendarProps {
  history: FocusDay[];
}

const FocusCalendar: React.FC<FocusCalendarProps> = ({ history }) => {
  const [selectedDay, setSelectedDay] = useState<FocusDay | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getDayData = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    return history.find((h) => h.date === dateStr);
  };

  const getHeatColor = (minutes: number) => {
    // Simple gradient: 0 = light gray, 120+ = dark green
    const max = 120;
    const intensity = Math.min(minutes / max, 1);
    const green = Math.floor(255 - intensity * 155);
    return `rgb(${green},255,${green})`;
  };

  const dateCellRender = (value: Dayjs) => {
    const data = getDayData(value);
    if (!data) return null;

    const tooltipText = `${data.minutes} min${
      data.avgFocusLevel ? `, Focus Level: ${data.avgFocusLevel}` : ""
    }`;

    return (
      <Tooltip title={tooltipText}>
        <div
          style={{
            textAlign: "center",
            width: "100%",
            height: "100%",
            lineHeight: "32px",
            borderRadius: "4px",
            backgroundColor: getHeatColor(data.minutes),
            cursor: "pointer",
            color: data.minutes > 60 ? "#fff" : "#000",
          }}
          onClick={() => {
            setSelectedDay(data);
            setIsModalVisible(true);
          }}
        >
          {value.date()}
        </div>
      </Tooltip>
    );
  };

  const getWeekTotal = (start: Dayjs) => {
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const day = start.add(i, "day");
      const dayData = getDayData(day);
      if (dayData) total += dayData.minutes;
    }
    return total;
  };

  const getMonthTotal = (date: Dayjs) => {
    const start = date.startOf("month");
    const end = date.endOf("month");
    let total = 0;
    for (
      let d = start.clone();
      d.isBefore(end) || d.isSame(end, "day");
      d = d.add(1, "day")
    ) {
      const dayData = getDayData(d);
      if (dayData) total += dayData.minutes;
    }
    return total;
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
        onPanelChange={() => {}}
      />

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <strong>Week Total:</strong>{" "}
        {getWeekTotal(dayjs()).toLocaleString()} min | <strong>Month Total:</strong>{" "}
        {getMonthTotal(dayjs()).toLocaleString()} min
      </div>

      <Modal
        title={selectedDay?.date}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedDay?.taskDetails && selectedDay.taskDetails.length > 0 ? (
          <ul>
            {selectedDay.taskDetails.map((t, i) => (
              <li key={i}>
                {t.task} - {t.minutes} min
                {t.focusLevel !== undefined ? ` (Focus: ${t.focusLevel})` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p>No session details for this day.</p>
        )}
        <p>
          Total Minutes: {selectedDay?.minutes} | Sessions: {selectedDay?.sessions || 1}
        </p>
      </Modal>
    </div>
  );
};

export default FocusCalendar;
