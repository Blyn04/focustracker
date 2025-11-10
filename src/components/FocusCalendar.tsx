import React, { useState } from "react";
import { Calendar, Tooltip, Modal, Tag, Badge } from "antd";
import type { CalendarProps, BadgeProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "antd/dist/reset.css";
import "../styles/FocusCalendar.css";

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

  const getHeatColor = (minutes: number) => {
    const max = 120;
    const ratio = Math.min(minutes / max, 1);
    const r = Math.floor(255 * ratio);
    const g = Math.floor(200 - ratio * 120);
    return `rgb(${r}, ${g}, 100, 0.3)`; // transparent overlay
  };

  const dateCellRender = (value: Dayjs) => {
    const data = getDayData(value);
    if (!data) return null;

    const tooltipText = `${data.minutes} min${
      data.avgFocusLevel ? `, Focus: ${data.avgFocusLevel}` : ""
    }`;

    const listData = [
      { type: "success", content: `${data.minutes} min` },
      ...(data.avgFocusLevel ? [{ type: "warning", content: `Focus ${data.avgFocusLevel}` }] : []),
    ];

    return (
      <Tooltip title={tooltipText}>
        <div style={{ position: "relative", width: "100%", height: "100%", cursor: "pointer" }}
             onClick={() => {
               setSelectedDay(data);
               setIsModalVisible(true);
             }}>
          {/* Heat overlay */}
          <div
            style={{
              backgroundColor: getHeatColor(data.minutes),
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "4px",
              zIndex: 0,
            }}
          />
          {/* Badges / info */}
          <ul
            className="events"
            style={{
              position: "relative",
              zIndex: 1,
              margin: 0,
              padding: 2,
              listStyle: "none",
              fontSize: "0.7rem",
            }}
          >
            {listData.map((item, i) => (
              <li key={i}>
                <Badge status={item.type as BadgeProps["status"]} text={item.content} />
              </li>
            ))}
          </ul>
        </div>
      </Tooltip>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
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
    for (let d = start.clone(); d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
      const dayData = getDayData(d);
      if (dayData) total += dayData.minutes;
    }
    return total;
  };

  return (
    <div className="focus-calendar-card">
      <h2>📅 Focus Calendar</h2>

      <Calendar cellRender={cellRender} fullscreen={false} className="focus-calendar" />

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
                  {t.focusLevel !== undefined && <Tag color="gold">Focus {t.focusLevel}</Tag>}
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
