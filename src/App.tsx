import React, { useState, useEffect } from "react";
import FocusTimer from "./components/FocusTimer";
import TaskList from "./components/TaskList";
import Stats from "./components/Stats";
import LandingPage from "./components/LandingPage";
import "./styles/App.css";

interface FocusData {
  totalMinutes: number;
  tasks: string[];
  lastFocusDate: string | null;
  streak: number;
  lastSaved?: string;
}

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [tasks, setTasks] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastFocusDate, setLastFocusDate] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>("");

  // ✅ Load saved data when app starts
  useEffect(() => {
    const saved = localStorage.getItem("focusData");
    if (saved) {
      const data: FocusData = JSON.parse(saved);
      setTotalMinutes(data.totalMinutes || 0);
      setTasks(data.tasks || []);
      setStreak(data.streak || 0);
      setLastFocusDate(data.lastFocusDate || null);
      setLastSaved(data.lastSaved || "");
    }
  }, []);

  useEffect(() => {
    const saveData: FocusData = {
      totalMinutes,
      tasks,
      streak,
      lastFocusDate,
      lastSaved: new Date().toLocaleString(),
    };
    localStorage.setItem("focusData", JSON.stringify(saveData));
    setLastSaved(saveData.lastSaved || ""); // ✅ fix here
  }, [totalMinutes, tasks, streak, lastFocusDate]);

  const handleSessionComplete = (minutes: number, task: string) => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = streak;

    if (lastFocusDate === today) {
      // same day, no streak increase
      newStreak = streak;
    } else if (lastFocusDate === yesterdayStr) {
      // focused yesterday, continue streak
      newStreak = streak + 1;
    } else {
      // missed a day or first session
      newStreak = 1;
    }

    setTotalMinutes((prev) => prev + minutes);
    if (task && !tasks.includes(task)) setTasks((prev) => [...prev, task]);
    setStreak(newStreak);
    setLastFocusDate(today);
  };

  return (
    <div className="app">
      {!hasStarted ? (
        <LandingPage onStart={() => setHasStarted(true)} />
      ) : (
        <>
          <h1>🎯 Focus Tracker</h1>
          <FocusTimer onSessionComplete={handleSessionComplete} />
          <Stats totalMinutes={totalMinutes} streak={streak} />
          <p className="last-saved">💾 Auto-saved: {lastSaved}</p>
          <TaskList tasks={tasks} />
        </>
      )}
    </div>
  );
};

export default App;
