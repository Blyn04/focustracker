import React, { useState, useEffect } from "react";
import FocusTimer from "./components/FocusTimer";
import TaskList from "./components/TaskList";
import Stats from "./components/Stats";
import LandingPage from "./components/LandingPage";
import FocusCalendar from "./components/FocusCalendar"; // new import
import "./styles/App.css";

interface FocusDay {
  date: string; // "YYYY-MM-DD"
  minutes: number;
  avgFocusLevel?: number;
}

interface FocusData {
  totalMinutes: number;
  tasks: string[];
  lastFocusDate: string | null;
  streak: number;
  history: FocusDay[]; // added history
  lastSaved?: string;
}

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [tasks, setTasks] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastFocusDate, setLastFocusDate] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [history, setHistory] = useState<FocusDay[]>([]); // new state

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
      setHistory(data.history || []);
    }
  }, []);

  // ✅ Save data whenever it changes
  useEffect(() => {
    const saveData: FocusData = {
      totalMinutes,
      tasks,
      streak,
      lastFocusDate,
      history,
      lastSaved: new Date().toLocaleString(),
    };
    localStorage.setItem("focusData", JSON.stringify(saveData));
    setLastSaved(saveData.lastSaved || "");
  }, [totalMinutes, tasks, streak, lastFocusDate, history]);

  // ✅ Handle session completion
  const handleSessionComplete = (minutes: number, task: string, level?: number) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    let newStreak = streak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastFocusDate === today.toDateString()) {
      newStreak = streak;
    } else if (lastFocusDate === yesterdayStr) {
      newStreak = streak + 1;
    } else {
      newStreak = 1;
    }

    setTotalMinutes((prev) => prev + minutes);
    if (task && !tasks.includes(task)) {
      setTasks((prev) => [...prev, `${task} (Focus: ${level ?? "-"})`]);
    }
    setStreak(newStreak);
    setLastFocusDate(today.toDateString());

    // Update history
    setHistory((prev) => {
      const existing = prev.find((h) => h.date === todayStr);
      if (existing) {
        const newAvg =
          existing.avgFocusLevel && level
            ? (existing.avgFocusLevel + level) / 2
            : level ?? existing.avgFocusLevel;
        return prev.map((h) =>
          h.date === todayStr
            ? { ...h, minutes: h.minutes + minutes, avgFocusLevel: newAvg }
            : h
        );
      } else {
        return [...prev, { date: todayStr, minutes, avgFocusLevel: level }];
      }
    });
  };

  return (
    <div className="app">
      {!hasStarted ? (
        <LandingPage onStart={() => setHasStarted(true)} />
      ) : (
        <div className="main-content">
          <h1>🎯 Focus Tracker</h1>
          <FocusTimer onSessionComplete={handleSessionComplete} />
          <Stats totalMinutes={totalMinutes} streak={streak} />
          <p className="last-saved">💾 Auto-saved: {lastSaved}</p>
          <TaskList tasks={tasks} />
          <FocusCalendar history={history} />
        </div>
      )}
    </div>
  );
};

export default App;
