import React, { useState, useEffect } from "react";
import "../styles/FocusTimer.css";
import FocusLevelSelector from "./FocusLevelSelector"; // make sure to create this

interface FocusTimerProps {
  onSessionComplete: (minutes: number, task: string, level?: number) => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);  
  const [task, setTask] = useState("");
  const [focusLevel, setFocusLevel] = useState<number | null>(null);
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStop = () => {
    setIsRunning(false);

    if (!task.trim()) {
      alert("Please enter a task before starting!");
      return;
    }

    // Show the focus level selector after stopping
    setShowLevelSelector(true);
  };

  const handleLevelSelect = (level: number) => {
    const minutes = Math.max(1, Math.floor(seconds / 60));
    setFocusLevel(level);

    // Complete session with focus level
    onSessionComplete(minutes, task.trim(), level);

    // Reset timer and task input
    setSeconds(0);
    setTask("");
    setFocusLevel(null);
    setShowLevelSelector(false);
  };

  return (
    <div className="focus-timer">
      <input
        type="text"
        placeholder="Enter task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        disabled={isRunning || showLevelSelector} // prevent edits while running or selecting level
      />

      <h2>
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
      </h2>

      {showLevelSelector ? (
        <FocusLevelSelector onSelect={handleLevelSelect} />
      ) : (
        <div className="timer-buttons">
          {!isRunning ? (
            <button
              onClick={() => {
                if (!task.trim()) {
                  alert("Enter a task before starting!");
                  return;
                }
                setIsRunning(true);
              }}
            >
              Start
            </button>
          ) : (
            <button onClick={handleStop}>Stop</button>
          )}
        </div>
      )}
    </div>
  );
};

export default FocusTimer;
