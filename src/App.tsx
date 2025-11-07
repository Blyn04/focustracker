import React, { useState } from "react";
import FocusTimer from "./components/FocusTimer";
import TaskList from "./components/TaskList";
import Stats from "./components/Stats";
import "./styles/App.css";

const App: React.FC = () => {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [tasks, setTasks] = useState<string[]>([]);

  const handleSessionComplete = (minutes: number, task: string) => {
    setTotalMinutes((prev) => prev + minutes);
    if (task && !tasks.includes(task)) {
      setTasks([...tasks, task]);
    }
  };

  return (
    <div className="app">
      <h1>🎯 Focus Tracker</h1>
      <FocusTimer onSessionComplete={handleSessionComplete} />
      <TaskList tasks={tasks} />
      <Stats totalMinutes={totalMinutes} />
    </div>
  );
};

export default App;
