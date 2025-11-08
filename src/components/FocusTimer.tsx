import React, { useState, useEffect } from "react";
import "../styles/FocusTimer.css";

interface FocusTimerProps {
  onSessionComplete: (minutes: number, task: string) => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStop = () => {
    setIsRunning(false);

    // Calculate minutes, but allow even <1 minute to count as 1
    const minutes = Math.max(1, Math.floor(seconds / 60));

    if (task.trim() !== "") {
      onSessionComplete(minutes, task.trim());
    } else {
      alert("Please enter a task before starting!");
    }

    setSeconds(0);
    setTask("");
  };

  return (
    <div className="focus-timer">
      <input
        type="text"
        placeholder="Enter task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <h2>
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
      </h2>

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
    </div>
  );
};

export default FocusTimer;
