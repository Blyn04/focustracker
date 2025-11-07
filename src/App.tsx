import React, { useState, useEffect } from "react";
import FocusTimer from "./components/FocusTimer";
import TaskList from "./components/TaskList";
import Stats from "./components/Stats";
import "./styles/App.css";

interface FocusData {
  totalMinutes: number;
  tasks: string[];
  lastFocusDate: string | null;
  streak: number;
}

const App: React.FC = () => {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [tasks, setTasks] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  // 🔹 Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("focusData");
    if (saved) {
      const data: FocusData = JSON.parse(saved);
      setTotalMinutes(data.totalMinutes);
      setTasks(data.tasks);
      setStreak(data.streak);
    }
  }, []);

  // 🔹 Save data automatically whenever it changes
  useEffect(() => {
    const focusData: FocusData = {
      totalMinutes,
      tasks,
      streak,
      lastFocusDate: new Date().toISOString(),
    };
    localStorage.setItem("focusData", JSON.stringify(focusData));
  }, [totalMinutes, tasks, streak]);

  // 🔹 Handle completed focus session
  const handleSessionComplete = (minutes: number, task: string) => {
    setTotalMinutes((prev) => prev + minutes);

    if (task && !tasks.includes(task)) {
      setTasks((prev) => [...prev, task]);
    }

    // 🔹 Handle streaks
    const today = new Date().toDateString();
    const saved = localStorage.getItem("focusData");
    let lastDate: string | null = null;

    if (saved) {
      const parsed: FocusData = JSON.parse(saved);
      lastDate = parsed.lastFocusDate;
    }

    if (lastDate) {
      const diff =
        (new Date(today).getTime() - new Date(lastDate).getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) {
        // continued streak
        setStreak((prev) => prev + 1);
      } else if (diff > 1) {
        // missed a day
        setStreak(1);
      } // if same day, keep it
    } else {
      setStreak(1);
    }
  };

  return (
    <div className="app">
      <h1>🎯 Focus Tracker</h1>
      <FocusTimer onSessionComplete={handleSessionComplete} />
      <Stats totalMinutes={totalMinutes} streak={streak} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default App;
