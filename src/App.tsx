import React, { useState, useEffect } from "react";
import FocusTimer, { TaskPriority } from "./components/FocusTimer";
import TaskList, { TaskItem } from "./components/TaskList";
import Stats from "./components/Stats";
import LandingPage from "./components/LandingPage";
import FocusCalendar from "./components/FocusCalendar";
import Confetti from "react-confetti";
import "./styles/App.css";
import BadgePanel from "./components/BadgePanel";
import Header from "./components/Header";

interface FocusDay {
  date: string;
  minutes: number;
  avgFocusLevel?: number;
  sessions?: number;
}

interface FocusData {
  totalMinutes: number;
  tasks: TaskItem[];
  lastFocusDate: string | null;
  streak: number;
  history: FocusDay[];
  lastSaved?: string;
}

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastFocusDate, setLastFocusDate] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [history, setHistory] = useState<FocusDay[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<TaskItem[]>([]);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  // Load saved data
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

  // Auto-save data
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

  // Handle focus session complete
  const handleSessionComplete = (
    minutes: number,
    taskName: string,
    priority: TaskPriority = "Medium",
    level?: number
  ) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    let newStreak = streak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastFocusDate === today.toDateString()) newStreak = streak;
    else if (lastFocusDate === yesterdayStr) newStreak = streak + 1;
    else newStreak = 1;

    setTotalMinutes((prev) => prev + minutes);
    setStreak(newStreak);
    setLastFocusDate(today.toDateString());

    // Update tasks
    setTasks((prev) => [
      ...prev,
      { name: taskName, priority, focusLevel: level, date: todayStr },
    ]);

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
            ? {
                ...h,
                minutes: h.minutes + minutes,
                avgFocusLevel: newAvg,
                sessions: (h.sessions || 0) + 1,
              }
            : h
        );
      } else {
        return [
          ...prev,
          { date: todayStr, minutes, avgFocusLevel: level, sessions: 1 },
        ];
      }
    });

    // Badge logic
    const todaySessions =
      (history.find((h) => h.date === todayStr)?.sessions || 0) + 1;
    const newBadges: string[] = [];

    if (totalMinutes + minutes >= 100 && !earnedBadges.includes("100 Minutes Focus")) {
      newBadges.push("100 Minutes Focus");
    }
    if (newStreak >= 7 && !earnedBadges.includes("7-Day Streak")) {
      newBadges.push("7-Day Streak");
    }
    if (todaySessions >= 5 && !earnedBadges.includes("5 Sessions in a Day")) {
      newBadges.push("5 Sessions in a Day");
    }

    if (newBadges.length > 0) {
      setEarnedBadges((prev) => [...prev, ...newBadges]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="app">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      {!hasStarted ? (
        <LandingPage onStart={() => setHasStarted(true)} />
      ) : (
        <>
          <Header onShowBadges={() => setShowAchievements(true)} />

          <div className="main-content">
            <FocusTimer
              onSessionComplete={handleSessionComplete}
              onAddTask={(task, priority) =>
                setPendingTasks((prev) => [...prev, { name: task, priority }])
              }
              activeTask={activeTask ?? undefined} // <<< fix here
            />
            <Stats totalMinutes={totalMinutes} streak={streak} />
            <p className="last-saved">💾 Auto-saved: {lastSaved}</p>
            <TaskList
              tasks={tasks}
              pendingTasks={pendingTasks}
              onStartTask={(taskName) => setActiveTask(taskName)}
            />

            <FocusCalendar history={history} />
          </div>

          <BadgePanel
            earnedBadges={earnedBadges}
            visible={showAchievements}
            onClose={() => setShowAchievements(false)}
          />
        </>
      )}
    </div>
  );
}

export default App;
