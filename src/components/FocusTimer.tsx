import React, { useState, useEffect } from "react";
import "../styles/FocusTimer.css";
import FocusLevelSelector from "./FocusLevelSelector";
import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

export type TaskPriority = "High" | "Medium" | "Low";

interface FocusTimerProps {
  onSessionComplete: (
    minutes: number,
    task: string,
    priority: TaskPriority,
    level?: number
  ) => void;
  onAddTask: (task: string, priority: TaskPriority) => void; // 👈 NEW PROP
  activeTask?: string; // 👈 Optional active task name
}

function FocusTimer({ onSessionComplete, onAddTask, activeTask }: FocusTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [focusLevel, setFocusLevel] = useState<number | null>(null);
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  // timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  const handleAddTask = () => {
    if (!task.trim()) {
      alert("Please enter a task name!");
      return;
    }
    onAddTask(task.trim(), priority);
    setTask("");
    setPriority("Medium");
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (!activeTask) return;
    setShowLevelSelector(true);
  };

  const handlePause = () => setIsPaused((prev) => !prev);

  const handleLevelSelect = (level: number) => {
    const minutes = seconds / 60;
    setFocusLevel(level);
    onSessionComplete(minutes, activeTask || "", priority, level);
    setSeconds(0);
    setFocusLevel(null);
    setShowLevelSelector(false);
  };

  const menu = (
    <Menu>
      {(["High", "Medium", "Low"] as TaskPriority[]).map((p) => (
        <Menu.Item key={p} onClick={() => setPriority(p)}>
          {p} Priority
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="focus-timer">
      {!activeTask ? (
        <>
          <div className="input-row">
            <input
              type="text"
              placeholder="Add a new task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              disabled={isRunning || showLevelSelector}
            />
            <Dropdown overlay={menu}>
              <Button>
                {priority} Priority <DownOutlined />
              </Button>
            </Dropdown>
            <button className="add-task-btn" onClick={handleAddTask}>
              + Add
            </button>
          </div>
          <p style={{ textAlign: "center", color: "#777" }}>
            Select a task from your list to start focusing.
          </p>
        </>
      ) : (
        <>
          <h3 style={{ textAlign: "center" }}>🎯 Focusing on: {activeTask}</h3>
          <h2>
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </h2>

          {showLevelSelector ? (
            <FocusLevelSelector onSelect={handleLevelSelect} />
          ) : (
            <div className="timer-buttons">
              {!isRunning ? (
                <button onClick={() => setIsRunning(true)}>Start</button>
              ) : (
                <>
                  <button onClick={handlePause}>
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                  <button onClick={handleStop}>Stop</button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FocusTimer;
