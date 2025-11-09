import React, { useState } from "react";
import { Calendar, Tooltip, Modal, Tag } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "antd/dist/reset.css";
import "../styles/FocusCalendar.css"

export interface FocusDay {
  date: string;
  minutes: number;
  avgFocusLevel?: number;
  sessions?: number;
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

  // Gradient: green (low focus) → orange → red (high focus)
  const getHeatColor = (minutes: number) => {
    const max = 120;
    const ratio = Math.min(minutes / max, 1);
    const r = Math.floor(255 * ratio);
    const g = Math.floor(200 - ratio * 120);
    return `rgb(${r}, ${g}, 100)`;
  };

  const dateCellRender = (value: Dayjs) => {
    const data = getDayData(value);
    if (!data) return null;

    const tooltipText = `${data.minutes} min${
      data.avgFocusLevel ? `, Focus: ${data.avgFocusLevel}` : ""
    }`;

    return (
      <Tooltip title={tooltipText}>
        <div
          className="focus-day-cell"
          style={{
            backgroundColor: getHeatColor(data.minutes),
            color: data.minutes > 60 ? "#fff" : "#222",
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
    <div className="focus-calendar-card">
      <h2>📅 Focus Calendar</h2>

      <Calendar
        dateCellRender={dateCellRender}
        fullscreen={false}
        className="focus-calendar"
      />

      <div className="focus-summary">
        <Tag color="green">
          Week Total: {getWeekTotal(dayjs()).toLocaleString()} min
        </Tag>
        <Tag color="blue">
          Month Total: {getMonthTotal(dayjs()).toLocaleString()} min
        </Tag>
      </div>

      <Modal
        title={`Focus Details - ${selectedDay?.date}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="focus-modal"
      >
        {selectedDay?.taskDetails?.length ? (
          <ul className="focus-task-list">
            {selectedDay.taskDetails.map((t, i) => (
              <li key={i}>
                <span>{t.task}</span>
                <span>
                  {t.minutes} min{" "}
                  {t.focusLevel !== undefined && (
                    <Tag color="gold">Focus {t.focusLevel}</Tag>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No session details for this day.</p>
        )}

        <div className="focus-modal-footer">
          <p>
            <strong>Total:</strong> {selectedDay?.minutes} min
          </p>
          <p>
            <strong>Sessions:</strong> {selectedDay?.sessions || 1}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default FocusCalendar;
